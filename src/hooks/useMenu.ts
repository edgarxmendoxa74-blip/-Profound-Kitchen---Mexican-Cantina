import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem, Variation, AddOn } from '../types';

// Helper: map DB row → MenuItem (camelCase frontend type)
const mapRowToMenuItem = (row: any, variations: Variation[], addOns: AddOn[]): MenuItem => {
    const now = new Date().toISOString();
    const isOnDiscount =
        !!row.discount_active &&
        !!row.discount_price &&
        row.discount_price < row.base_price &&
        (!row.discount_start_date || new Date(row.discount_start_date) <= new Date(now)) &&
        (!row.discount_end_date || new Date(row.discount_end_date) >= new Date(now));

    return {
        id: row.id,
        name: row.name,
        description: row.description,
        basePrice: row.base_price,
        category: row.category,
        image: row.image_url || undefined,
        images: row.images || [],
        popular: row.popular ?? false,
        available: row.available ?? true,
        weight: row.weight ?? 0.5,
        discountPrice: row.discount_price ?? undefined,
        discountStartDate: row.discount_start_date ?? undefined,
        discountEndDate: row.discount_end_date ?? undefined,
        discountActive: row.discount_active ?? false,
        effectivePrice: isOnDiscount ? row.discount_price : row.base_price,
        isOnDiscount,
        variations,
        addOns,
        stock: row.stock ?? 0,
    };
};

// Cache at the module level to persist across hook instances
let menuCache: MenuItem[] | null = null;
let lastMenuFetchTime = 0;
const MENU_CACHE_DURATION = 2 * 60 * 1000; // 2 mins (shorter for products)

export const useMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(menuCache || []);
    const [loading, setLoading] = useState(!menuCache);
    const [error, setError] = useState<string | null>(null);

    const fetchMenuItems = async (force: boolean = false) => {
        try {
            if (!force && menuCache && (Date.now() - lastMenuFetchTime < MENU_CACHE_DURATION)) {
                setMenuItems(menuCache);
                setLoading(false);
                return;
            }

            setLoading(true);

            // Fetch menu items, their variations, and their add-ons in parallel
            const [itemsRes, variationsRes, addOnsRes] = await Promise.all([
                supabase.from('menu_items').select('*').order('created_at', { ascending: true }),
                supabase.from('variations').select('*'),
                supabase.from('add_ons').select('*'),
            ]);

            if (itemsRes.error) throw itemsRes.error;
            if (variationsRes.error) throw variationsRes.error;
            if (addOnsRes.error) throw addOnsRes.error;

            const items = (itemsRes.data || []).map((row) => {
                const variations: Variation[] = (variationsRes.data || [])
                    .filter((v: any) => v.menu_item_id === row.id)
                    .map((v: any) => ({
                        id: v.id,
                        name: v.name,
                        price: v.price,
                        image: v.image || undefined,
                        stock: v.stock ?? 0,
                    }));

                const addOns: AddOn[] = (addOnsRes.data || [])
                    .filter((a: any) => a.menu_item_id === row.id)
                    .map((a: any) => ({
                        id: a.id,
                        name: a.name,
                        price: a.price,
                        category: a.category,
                    }));

                return mapRowToMenuItem(row, variations, addOns);
            });

            setMenuItems(items);
            menuCache = items;
            lastMenuFetchTime = Date.now();
            setError(null);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
        } finally {
            setLoading(false);
        }
    };

    const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
        // Core insert data (guaranteed columns)
        const coreInsert: any = {
            name: item.name,
            description: item.description,
            base_price: item.basePrice,
            category: item.category,
            image_url: item.image || null,
            popular: item.popular ?? false,
            available: item.available ?? true,
            discount_price: item.discountPrice ?? null,
            discount_start_date: item.discountStartDate ?? null,
            discount_end_date: item.discountEndDate || null,
            discount_active: item.discountActive ?? false,
        };

        // Extended fields (may not exist in DB)
        const extendedInsert: any = {
            weight: item.weight ?? 0.5,
            images: item.images || [],
            stock: item.stock ?? 0,
        };

        // Try with all fields first
        let insertData = { ...coreInsert, ...extendedInsert };
        let { data: newRow, error: insertError } = await supabase
            .from('menu_items')
            .insert(insertData)
            .select()
            .single();

        // If 400 error, retry with core-only fields
        if (insertError) {
            console.warn('[useMenu] Full insert failed, retrying with core fields only:', insertError.message);
            const { data: retryRow, error: retryError } = await supabase
                .from('menu_items')
                .insert(coreInsert)
                .select()
                .single();

            if (retryError) {
                console.error('[useMenu] Core-only insert also failed:', retryError);
                throw retryError;
            }
            newRow = retryRow;
        }

        const menuItemId = newRow.id;

        // Insert variations
        if (item.variations && item.variations.length > 0) {
            const variationsWithStock = item.variations.map((v) => ({
                menu_item_id: menuItemId,
                name: v.name,
                price: v.price,
                image: v.image || null,
                stock: v.stock ?? 0,
            }));

            let { error: varError } = await supabase.from('variations').insert(variationsWithStock);

            if (varError) {
                console.warn('[useMenu] Insert variations with stock failed, retrying without stock:', varError.message);
                const variationsWithoutStock = item.variations.map((v) => ({
                    menu_item_id: menuItemId,
                    name: v.name,
                    price: v.price,
                    image: v.image || null,
                }));
                const { error: retryVarError } = await supabase.from('variations').insert(variationsWithoutStock);
                if (retryVarError) throw retryVarError;
            }
        }

        // Insert add-ons
        if (item.addOns && item.addOns.length > 0) {
            const { error: addOnError } = await supabase.from('add_ons').insert(
                item.addOns.map((a) => ({
                    menu_item_id: menuItemId,
                    name: a.name,
                    price: a.price,
                    category: a.category,
                }))
            );
            if (addOnError) throw addOnError;
        }

        await fetchMenuItems(true);
        return newRow;
    };

    const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
        // Build core fields (guaranteed to exist in base schema)
        const coreData: any = {};
        if (updates.name !== undefined) coreData.name = updates.name;
        if (updates.description !== undefined) coreData.description = updates.description;
        if (updates.basePrice !== undefined) coreData.base_price = updates.basePrice;
        if (updates.category !== undefined) coreData.category = updates.category;
        if (updates.image !== undefined) coreData.image_url = updates.image || null;
        if (updates.popular !== undefined) coreData.popular = updates.popular;
        if (updates.available !== undefined) coreData.available = updates.available;
        if (updates.discountPrice !== undefined) coreData.discount_price = updates.discountPrice || null;
        if (updates.discountStartDate !== undefined) coreData.discount_start_date = updates.discountStartDate || null;
        if (updates.discountEndDate !== undefined) coreData.discount_end_date = updates.discountEndDate || null;
        if (updates.discountActive !== undefined) coreData.discount_active = updates.discountActive ?? false;

        // Extended fields (from later migrations - may not exist)
        const extendedData: any = {};
        if (updates.weight !== undefined) extendedData.weight = updates.weight;
        if (updates.images !== undefined) extendedData.images = updates.images || [];
        if (updates.stock !== undefined) extendedData.stock = updates.stock ?? 0;

        console.log('[useMenu] updateMenuItem called for id:', id);
        console.log('[useMenu] coreData:', JSON.stringify(coreData, null, 2));
        console.log('[useMenu] extendedData:', JSON.stringify(extendedData, null, 2));

        // Try update with all fields first
        let updateData = { ...coreData, ...extendedData };
        let { error: updateError } = await supabase
            .from('menu_items')
            .update(updateData)
            .eq('id', id);

        // If 400 error, retry with core-only fields (extended columns may not exist in DB)
        if (updateError && (updateError as any).code === 'PGRST204' || (updateError && updateError.message?.includes('column'))) {
            console.warn('[useMenu] Full update failed, retrying with core fields only:', updateError.message);
            const { error: retryError } = await supabase
                .from('menu_items')
                .update(coreData)
                .eq('id', id);

            if (retryError) {
                console.error('[useMenu] Core-only update also failed:', retryError);
                throw retryError;
            }
            console.log('[useMenu] Core-only update succeeded');
        } else if (updateError) {
            console.error('[useMenu] Update error:', updateError.message, updateError);
            throw updateError;
        } else {
            console.log('[useMenu] Full update succeeded');
        }

        // Replace variations: delete old, insert new
        if (updates.variations !== undefined) {
            console.log('[useMenu] Replacing variations, count:', updates.variations.length);
            const { error: delVarError } = await supabase
                .from('variations')
                .delete()
                .eq('menu_item_id', id);

            if (delVarError) {
                console.error('[useMenu] Delete variations error:', delVarError);
                throw delVarError;
            }

            if (updates.variations.length > 0) {
                // Try with stock first, fallback without stock
                const variationsWithStock = updates.variations.map((v) => ({
                    menu_item_id: id,
                    name: v.name,
                    price: v.price || 0,
                    image: v.image || null,
                    stock: v.stock ?? 0,
                }));

                let { error: insVarError } = await supabase.from('variations').insert(variationsWithStock);

                if (insVarError) {
                    console.warn('[useMenu] Insert variations with stock failed, retrying without stock:', insVarError.message);
                    const variationsWithoutStock = updates.variations.map((v) => ({
                        menu_item_id: id,
                        name: v.name,
                        price: v.price || 0,
                        image: v.image || null,
                    }));
                    const { error: retryVarError } = await supabase.from('variations').insert(variationsWithoutStock);
                    if (retryVarError) {
                        console.error('[useMenu] Insert variations (no stock) error:', retryVarError);
                        throw retryVarError;
                    }
                }
            }
        }

        // Replace add-ons: delete old, insert new
        if (updates.addOns !== undefined) {
            console.log('[useMenu] Replacing add-ons, count:', updates.addOns.length);
            const { error: delAddOnError } = await supabase
                .from('add_ons')
                .delete()
                .eq('menu_item_id', id);

            if (delAddOnError) {
                console.error('[useMenu] Delete add-ons error:', delAddOnError);
                throw delAddOnError;
            }

            if (updates.addOns.length > 0) {
                const addOnData = updates.addOns.map((a) => ({
                    menu_item_id: id,
                    name: a.name,
                    price: a.price || 0,
                    category: a.category,
                }));
                const { error: insAddOnError } = await supabase.from('add_ons').insert(addOnData);
                if (insAddOnError) {
                    console.error('[useMenu] Insert add-ons error:', insAddOnError);
                    throw insAddOnError;
                }
            }
        }

        console.log('[useMenu] Update complete, re-fetching menu items...');
        await fetchMenuItems(true);
    };

    const deleteMenuItem = async (id: string) => {
        // Variations and add-ons should cascade delete via DB foreign keys,
        // but we delete them explicitly as a safety measure.
        await supabase.from('variations').delete().eq('menu_item_id', id);
        await supabase.from('add_ons').delete().eq('menu_item_id', id);

        const { error: deleteError } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        await fetchMenuItems(true);
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    return {
        menuItems,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        refetch: fetchMenuItems,
    };
};
