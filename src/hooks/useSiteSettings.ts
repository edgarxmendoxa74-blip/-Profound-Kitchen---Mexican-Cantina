import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id');

      if (error) throw error;

      // Transform the data into a more usable format
      const settings: SiteSettings = {
        site_name: data.find(s => s.id === 'site_name')?.value || 'Profound Plus Kitchen',
        site_logo: data.find(s => s.id === 'site_logo')?.value || '',
        site_description: data.find(s => s.id === 'site_description')?.value || 'A Modern Gourmet Haven in the Heart of the City',
        currency: data.find(s => s.id === 'currency')?.value || 'PHP',
        currency_code: data.find(s => s.id === 'currency_code')?.value || 'PHP',
        hero_subtitle: data.find(s => s.id === 'hero_subtitle')?.value || 'Vibrant flavors, elegant atmosphere, and an unforgettable culinary journey.',
        hero_images: (() => {
          const val = data.find(s => s.id === 'hero_images')?.value;
          if (!val) return [];
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error('Error parsing hero_images:', e);
            return [];
          }
        })(),
        shipping_rates: (() => {
          const val = data.find(s => s.id === 'shipping_rates')?.value;
          if (!val) return undefined;
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error('Error parsing shipping_rates:', e);
            return undefined;
          }
        })(),
        store_hours: (() => {
          const val = data.find(s => s.id === 'store_hours')?.value;
          if (!val) return [];
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error('Error parsing store_hours:', e);
            return [];
          }
        })(),
        store_hours_summary: data.find(s => s.id === 'store_hours_summary')?.value || '',
        events_title: data.find(s => s.id === 'events_title')?.value || 'Host Your <br />\n<span class="text-brand-violet italic">Grand Event.</span>',
        events_subtitle: data.find(s => s.id === 'events_subtitle')?.value || 'Private Gatherings',
        events_description: data.find(s => s.id === 'events_description')?.value || 'From intimate celebrations to grand corporate gatherings, Profound + Kitchen provides the perfect backdrop of vibrant Mexican culture and sophisticated elegance.',
        events_feature1_title: data.find(s => s.id === 'events_feature1_title')?.value || 'Flexible PAX',
        events_feature1_desc: data.find(s => s.id === 'events_feature1_desc')?.value || 'Customizable seating arrangements for any group size.',
        events_feature2_title: data.find(s => s.id === 'events_feature2_title')?.value || 'Safe & Private',
        events_feature2_desc: data.find(s => s.id === 'events_feature2_desc')?.value || 'Dedicated event spaces with strict safety protocols.',
        events_button_text: data.find(s => s.id === 'events_button_text')?.value || 'Inquire Now',
        events_button_url: data.find(s => s.id === 'events_button_url')?.value || 'https://forms.gle/B4hsT2YbFSTEAtkH8',
        events_quote: data.find(s => s.id === 'events_quote')?.value || '"We make every celebration a profound experience."',
        events_form_title: data.find(s => s.id === 'events_form_title')?.value || 'Official PAX Form',
        events_form_link_text: data.find(s => s.id === 'events_form_link_text')?.value || 'Access Google Form',
        location_subtitle: data.find(s => s.id === 'location_subtitle')?.value || 'Find Your Sanctuary',
        location_title: data.find(s => s.id === 'location_title')?.value || 'Visit Our <br />\n<span class="text-brand-violet italic">Kitchen.</span>',
        location_address: data.find(s => s.id === 'location_address')?.value || 'Profound + Kitchen<br />26-B Sct Borromeo, South Triangle, Quezon City',
        location_phone: data.find(s => s.id === 'location_phone')?.value || '09062066175',
        location_map_title: data.find(s => s.id === 'location_map_title')?.value || 'Interactive Map',
        location_map_desc: data.find(s => s.id === 'location_map_desc')?.value || "Located in the heart of South Triangle's culinary district.",
        location_button_text: data.find(s => s.id === 'location_button_text')?.value || 'Get Directions',
        location_button_url: data.find(s => s.id === 'location_button_url')?.value || 'https://maps.app.goo.gl/9ZQXQXQXQXQXQXQX9',
        events_policies: (() => {
          const val = data.find(s => s.id === 'events_policies')?.value;
          if (!val) return [];
          try {
            return JSON.parse(val);
          } catch (e) {
            console.error('Error parsing events_policies:', e);
            return [];
          }
        })()
      };

      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (id: string, value: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site setting');
      throw err;
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      setError(null);

      const updatePromises = Object.entries(updates).map(([key, value]) => {
        let finalValue = value;
        if ((key === 'hero_images' || key === 'shipping_rates' || key === 'store_hours' || key === 'events_policies') && (Array.isArray(value) || typeof value === 'object')) {
          finalValue = JSON.stringify(value);
        }
        return supabase
          .from('site_settings')
          .update({ value: finalValue })
          .eq('id', key);
      });

      const results = await Promise.all(updatePromises);

      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Some updates failed');
      }

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    siteSettings,
    loading,
    error,
    updateSiteSetting,
    updateSiteSettings,
    refetch: fetchSiteSettings
  };
};
