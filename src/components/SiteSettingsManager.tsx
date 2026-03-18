import React, { useState } from 'react';
import { Save, Upload, X, Loader, Plus, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';
import { StoreHoursEntry } from '../types';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    hero_subtitle: '',
    hero_images: [] as string[],
    shipping_rates: {} as any,
    store_hours: [] as StoreHoursEntry[],
    store_hours_summary: '',
    events_title: '',
    events_subtitle: '',
    events_description: '',
    events_policies: [] as { title: string; desc: string }[],
    events_feature1_title: '',
    events_feature1_desc: '',
    events_feature2_title: '',
    events_feature2_desc: '',
    events_button_text: '',
    events_button_url: '',
    events_quote: '',
    events_form_title: '',
    events_form_link_text: '',
    location_subtitle: '',
    location_title: '',
    location_address: '',
    location_phone: '',
    location_map_title: '',
    location_map_desc: '',
    location_button_text: '',
    location_button_url: ''
  });
  const [heroFiles, setHeroFiles] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        hero_subtitle: siteSettings.hero_subtitle || '',
        hero_images: siteSettings.hero_images || [],
        shipping_rates: siteSettings.shipping_rates || {},
        store_hours: siteSettings.store_hours || [],
        store_hours_summary: siteSettings.store_hours_summary || '',
        events_title: siteSettings.events_title || '',
        events_subtitle: siteSettings.events_subtitle || '',
        events_description: siteSettings.events_description || '',
        events_policies: siteSettings.events_policies || [],
        events_feature1_title: siteSettings.events_feature1_title || '',
        events_feature1_desc: siteSettings.events_feature1_desc || '',
        events_feature2_title: siteSettings.events_feature2_title || '',
        events_feature2_desc: siteSettings.events_feature2_desc || '',
        events_button_text: siteSettings.events_button_text || '',
        events_button_url: siteSettings.events_button_url || '',
        events_quote: siteSettings.events_quote || '',
        events_form_title: siteSettings.events_form_title || '',
        events_form_link_text: siteSettings.events_form_link_text || '',
        location_subtitle: siteSettings.location_subtitle || '',
        location_title: siteSettings.location_title || '',
        location_address: siteSettings.location_address || '',
        location_phone: siteSettings.location_phone || '',
        location_map_title: siteSettings.location_map_title || '',
        location_map_desc: siteSettings.location_map_desc || '',
        location_button_text: siteSettings.location_button_text || '',
        location_button_url: siteSettings.location_button_url || ''
      });
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let logoUrl = logoPreview;

      // Upload new logo if selected
      if (logoFile) {
        try {
          console.log('Uploading logo...');
          const uploadedUrl = await uploadImage(logoFile);
          logoUrl = uploadedUrl;
          console.log('Logo uploaded successfully:', uploadedUrl);
        } catch (uploadError) {
          console.error('Logo upload error:', uploadError);
          alert(`❌ Failed to upload logo: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}\n\nPlease try again or use a different image.`);
          setIsSaving(false);
          return; // Don't proceed if logo upload fails
        }
      }

      // Handle Hero Images Upload
      const finalHeroImages = [...formData.hero_images];

      // We need to match base64 previews with their corresponding File objects
      // To simplify, if heroFiles has content, we'll upload them
      if (heroFiles.length > 0) {
        console.log(`Uploading ${heroFiles.length} hero images...`);
        const uploadPromises = heroFiles.map(file => uploadImage(file));
        const uploadedUrls = await Promise.all(uploadPromises);

        // Filter out base64 strings and add new URLs
        // Note: This logic assumes all base64s should be replaced by the newly uploaded ones
        // If the user mixed existing URLs and new files, we'd need more complex matching.
        // For now, let's replace matches or append.

        const nonBase64Images = finalHeroImages.filter(img => !img.startsWith('data:image'));
        finalHeroImages.length = 0;
        finalHeroImages.push(...nonBase64Images, ...uploadedUrls);
      }

      // Update all settings
      console.log('Updating settings...');
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        site_logo: logoUrl,
        hero_subtitle: formData.hero_subtitle,
        hero_images: finalHeroImages,
        store_hours: formData.store_hours,
        store_hours_summary: formData.store_hours_summary,
        events_title: formData.events_title,
        events_subtitle: formData.events_subtitle,
        events_description: formData.events_description,
        events_policies: formData.events_policies,
        events_feature1_title: formData.events_feature1_title,
        events_feature1_desc: formData.events_feature1_desc,
        events_feature2_title: formData.events_feature2_title,
        events_feature2_desc: formData.events_feature2_desc,
        events_button_text: formData.events_button_text,
        events_button_url: formData.events_button_url,
        events_quote: formData.events_quote,
        events_form_title: formData.events_form_title,
        events_form_link_text: formData.events_form_link_text,
        location_subtitle: formData.location_subtitle,
        location_title: formData.location_title,
        location_address: formData.location_address,
        location_phone: formData.location_phone,
        location_map_title: formData.location_map_title,
        location_map_desc: formData.location_map_desc,
        location_button_text: formData.location_button_text,
        location_button_url: formData.location_button_url
      });

      alert('✅ Site settings saved successfully! The changes will appear after page refresh.');
      setIsEditing(false);
      setLogoFile(null);
      setHeroFiles([]);

      // Refresh page to show updated settings
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert(`❌ Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        hero_subtitle: siteSettings.hero_subtitle || '',
        hero_images: siteSettings.hero_images || [],
        shipping_rates: siteSettings.shipping_rates || {},
        store_hours: siteSettings.store_hours || [],
        store_hours_summary: siteSettings.store_hours_summary || '',
        events_title: siteSettings.events_title || '',
        events_subtitle: siteSettings.events_subtitle || '',
        events_description: siteSettings.events_description || '',
        events_policies: siteSettings.events_policies || [],
        events_feature1_title: siteSettings.events_feature1_title || '',
        events_feature1_desc: siteSettings.events_feature1_desc || '',
        events_feature2_title: siteSettings.events_feature2_title || '',
        events_feature2_desc: siteSettings.events_feature2_desc || '',
        events_button_text: siteSettings.events_button_text || '',
        events_button_url: siteSettings.events_button_url || '',
        events_quote: siteSettings.events_quote || '',
        events_form_title: siteSettings.events_form_title || '',
        events_form_link_text: siteSettings.events_form_link_text || '',
        location_subtitle: siteSettings.location_subtitle || '',
        location_title: siteSettings.location_title || '',
        location_address: siteSettings.location_address || '',
        location_phone: siteSettings.location_phone || '',
        location_map_title: siteSettings.location_map_title || '',
        location_map_desc: siteSettings.location_map_desc || '',
        location_button_text: siteSettings.location_button_text || '',
        location_button_url: siteSettings.location_button_url || ''
      });
      setLogoPreview(siteSettings.site_logo);
    }
    setIsEditing(false);
    setLogoFile(null);
    setHeroFiles([]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm shadow-2xl p-8 border border-brand-silver">
      {/* Saving Indicator */}
      {isSaving && (
        <div className="bg-brand-gray border-l-4 border-brand-lavender rounded-sm p-6 mb-10 flex items-center space-x-5 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-lavender/5 animate-pulse"></div>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-lavender border-t-transparent relative z-10"></div>
          <div className="relative z-10">
            <p className="font-black text-[11px] text-brand-black uppercase tracking-[0.2em] font-montserrat">
              {uploading ? 'Processing Assets...' : 'Syncing Brand Profile...'}
            </p>
            <p className="text-[9px] text-brand-gray font-bold uppercase mt-1 tracking-wider">Establishing new identity parameters.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-black text-brand-black uppercase tracking-tighter font-montserrat">Store Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-brand-black text-white px-8 py-3 rounded-sm hover:bg-brand-lavender hover:text-black transition-all duration-700 flex items-center space-x-3 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 border border-transparent hover:border-brand-lavender/30"
          >
            <Save className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-100 text-gray-500 px-6 py-3 rounded-sm hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              <span>Discard</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || uploading}
              className="bg-brand-black text-white px-10 py-3 rounded-sm hover:bg-brand-lavender hover:text-black transition-all duration-700 flex items-center space-x-3 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl disabled:opacity-50 active:scale-95 border border-transparent hover:border-brand-lavender/30"
            >
              {isSaving || uploading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin text-brand-lavender" />
                  <span>{uploading ? 'Uploading...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Commit Changes</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-[11px] font-black text-brand-black mb-3 uppercase tracking-widest font-montserrat">
            Brand Identity
          </label>
          <div className="flex items-center space-x-6 bg-brand-gray/50 p-6 rounded-sm border border-brand-silver/50">
            <div className="w-24 h-24 rounded-sm overflow-hidden bg-white flex items-center justify-center ring-1 ring-brand-silver shadow-2xl">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`text-4xl font-black text-brand-black font-montserrat ${logoPreview ? 'hidden' : ''}`}>P</div>
            </div>
            <div className="flex-1">
              {isEditing && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                    disabled={isSaving || uploading}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`bg-white text-brand-black px-6 py-3 rounded-sm hover:border-brand-lavender transition-all duration-500 flex items-center space-x-3 cursor-pointer border border-brand-silver font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-[0_0_20px_rgba(188,166,255,0.2)] ${isSaving || uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    <Upload className="h-4 w-4" />
                    <span>{uploading ? 'Uploading...' : 'Update Logo'}</span>
                  </label>
                  <p className="text-[9px] text-gray-400 mt-3 font-bold uppercase tracking-tighter">
                    Optimal: 512x512px • JPG, PNG, WebP
                  </p>
                  {logoFile && (
                    <p className="text-[9px] text-brand-lavender mt-3 font-black uppercase tracking-[0.2em] font-montserrat animate-pulse">
                      ✓ Ready: {logoFile.name}
                    </p>
                  )}
                </div>
              )}
              {!isEditing && (
                <div>
                  <p className="text-[10px] font-black text-brand-black uppercase tracking-widest">Active Identity</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Logo displayed across all channels</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Store Hours */}
        <div className="mt-10">
          <label className="block text-[11px] font-black text-brand-black mb-3 uppercase tracking-widest font-montserrat">
            Store Hours
          </label>

          {/* Header Summary */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Header Bar Text
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.store_hours_summary}
                onChange={(e) => setFormData(prev => ({ ...prev, store_hours_summary: e.target.value }))}
                className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-xs font-black uppercase tracking-[0.2em] font-montserrat"
                placeholder="e.g. TUES - SUN • 11:00 AM - 10:00 PM"
              />
            ) : (
              <p className="text-sm font-bold text-brand-black">{siteSettings?.store_hours_summary || 'TUES - SUN • 11:00 AM - 10:00 PM'}</p>
            )}
            <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tighter">Shown in the top bar of the site header.</p>
          </div>

          {/* Schedule Rows */}
          <div className="space-y-3">
            {formData.store_hours.map((entry, index) => (
              <div key={index} className="flex items-center space-x-3 bg-brand-gray/30 p-4 rounded-sm border border-brand-silver/50">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={entry.label}
                      onChange={(e) => {
                        const updated = [...formData.store_hours];
                        updated[index] = { ...updated[index], label: e.target.value };
                        setFormData(prev => ({ ...prev, store_hours: updated }));
                      }}
                      className="flex-1 px-3 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold uppercase tracking-wider"
                      placeholder="e.g. Monday"
                    />
                    <input
                      type="text"
                      value={entry.hours}
                      onChange={(e) => {
                        const updated = [...formData.store_hours];
                        updated[index] = { ...updated[index], hours: e.target.value };
                        setFormData(prev => ({ ...prev, store_hours: updated }));
                      }}
                      className="flex-1 px-3 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold"
                      placeholder="e.g. 11:00 AM – 10:00 PM"
                    />
                    <button
                      onClick={() => {
                        const updated = formData.store_hours.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, store_hours: updated }));
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between w-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black">{entry.label}</span>
                    <span className="text-sm text-gray-500 font-medium">{entry.hours}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  store_hours: [...prev.store_hours, { label: '', hours: '' }]
                }));
              }}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-brand-black text-white rounded-sm hover:bg-brand-lavender hover:text-black transition-all duration-500 font-black text-[10px] uppercase tracking-widest font-montserrat border border-transparent hover:border-brand-lavender/30"
            >
              <Plus className="h-3 w-3" />
              <span>Add Schedule Row</span>
            </button>
          )}

          {formData.store_hours.length === 0 && !isEditing && (
            <p className="text-sm text-gray-400 italic mt-2">No store hours configured yet.</p>
          )}
        </div>

        {/* Events Settings */}
        <div className="mt-10">
          <label className="block text-[11px] font-black text-brand-black mb-3 uppercase tracking-widest font-montserrat">
            Events Section Text
          </label>

          {/* Subtitle */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Subtitle (e.g. Private Gatherings)
            </label>
            {isEditing ? (
              <input
                type="text"
                name="events_subtitle"
                value={formData.events_subtitle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-xs font-black uppercase tracking-[0.2em] font-montserrat"
              />
            ) : (
              <p className="text-sm font-bold text-brand-black">{formData.events_subtitle}</p>
            )}
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Main Title (Supports HTML)
            </label>
            {isEditing ? (
              <textarea
                name="events_title"
                value={formData.events_title}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-sm font-mono"
              />
            ) : (
              <div className="text-sm border border-gray-100 p-3 bg-gray-50 rounded-sm overflow-x-auto whitespace-pre-wrap">{formData.events_title}</div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Description Paragraph
            </label>
            {isEditing ? (
              <textarea
                name="events_description"
                value={formData.events_description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-sm"
              />
            ) : (
              <p className="text-sm text-gray-600">{formData.events_description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Feature 1 (e.g. Flexible PAX)</label>
              {isEditing ? (
                <>
                  <input type="text" name="events_feature1_title" value={formData.events_feature1_title} onChange={handleInputChange} placeholder="Title" className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs font-bold" />
                  <textarea name="events_feature1_desc" value={formData.events_feature1_desc} onChange={handleInputChange} placeholder="Description" rows={2} className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs" />
                </>
              ) : (
                <div><p className="text-xs font-bold mb-1">{formData.events_feature1_title}</p><p className="text-xs text-gray-500">{formData.events_feature1_desc}</p></div>
              )}
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Feature 2 (e.g. Safe & Private)</label>
              {isEditing ? (
                <>
                  <input type="text" name="events_feature2_title" value={formData.events_feature2_title} onChange={handleInputChange} placeholder="Title" className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs font-bold" />
                  <textarea name="events_feature2_desc" value={formData.events_feature2_desc} onChange={handleInputChange} placeholder="Description" rows={2} className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs" />
                </>
              ) : (
                <div><p className="text-xs font-bold mb-1">{formData.events_feature2_title}</p><p className="text-xs text-gray-500">{formData.events_feature2_desc}</p></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Button Text</label>
              {isEditing ? (
                <input type="text" name="events_button_text" value={formData.events_button_text} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs" />
              ) : (
                <p className="text-xs">{formData.events_button_text}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">Button Link (URL)</label>
              {isEditing ? (
                <input type="text" name="events_button_url" value={formData.events_button_url} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender text-xs" />
              ) : (
                <p className="text-xs break-all">{formData.events_button_url}</p>
              )}
            </div>
          </div>

          <label className="block text-[11px] font-black text-brand-black mb-3 uppercase tracking-widest font-montserrat">
            Event Policies
          </label>

          {/* Policies Rows */}
          <div className="space-y-4">
            {formData.events_policies.map((policy, index) => (
              <div key={index} className="flex items-start space-x-3 bg-brand-gray/30 p-4 rounded-sm border border-brand-silver/50">
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={policy.title}
                      onChange={(e) => {
                        const updated = [...formData.events_policies];
                        updated[index] = { ...updated[index], title: e.target.value };
                        setFormData(prev => ({ ...prev, events_policies: updated }));
                      }}
                      className="w-full px-3 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-[10px] font-bold uppercase tracking-wider"
                      placeholder="Title (e.g. Menu Customization)"
                    />
                    <textarea
                      value={policy.desc}
                      onChange={(e) => {
                        const updated = [...formData.events_policies];
                        updated[index] = { ...updated[index], desc: e.target.value };
                        setFormData(prev => ({ ...prev, events_policies: updated }));
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-white text-xs"
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-black mb-1">{policy.title}</span>
                    <span className="text-sm text-gray-500">{policy.desc}</span>
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => {
                      const updated = formData.events_policies.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, events_policies: updated }));
                    }}
                    className="p-2 mt-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors self-start"
                    title="Remove policy"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <button
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  events_policies: [...prev.events_policies, { title: '', desc: '' }]
                }));
              }}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-brand-black text-white rounded-sm hover:bg-brand-lavender hover:text-black transition-all duration-500 font-black text-[10px] uppercase tracking-widest font-montserrat border border-transparent hover:border-brand-lavender/30"
            >
              <Plus className="h-3 w-3" />
              <span>Add Event Policy</span>
            </button>
          )}

          {formData.events_policies.length === 0 && !isEditing && (
            <p className="text-sm text-gray-400 italic mt-2">No event policies configured yet.</p>
          )}

          <div className="mt-8 border-t border-brand-silver/50 pt-8">
            <label className="block text-[11px] font-black text-brand-black mb-4 uppercase tracking-widest font-montserrat">
              Events Footer Elements
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Footer Quote</label>
                {isEditing ? <input type="text" name="events_quote" value={formData.events_quote} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm font-medium italic">{formData.events_quote}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Form Section Title</label>
                  {isEditing ? <input type="text" name="events_form_title" value={formData.events_form_title} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm font-bold">{formData.events_form_title}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Form Button Text</label>
                  {isEditing ? <input type="text" name="events_form_link_text" value={formData.events_form_link_text} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm">{formData.events_form_link_text}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section Settings */}
        <div className="mt-10">
          <label className="block text-[11px] font-black text-brand-black mb-3 uppercase tracking-widest font-montserrat">
            Location Section Text
          </label>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Subtitle</label>
              {isEditing ? <input type="text" name="location_subtitle" value={formData.location_subtitle} onChange={handleInputChange} className="w-full px-4 py-3 border border-brand-silver rounded-sm text-xs font-black uppercase tracking-[0.2em]" /> : <p className="text-sm font-bold">{formData.location_subtitle}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Title (Supports HTML)</label>
              {isEditing ? <textarea name="location_title" value={formData.location_title} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm font-mono" /> : <div className="text-sm border border-gray-100 p-3 bg-gray-50 rounded-sm overflow-x-auto whitespace-pre-wrap">{formData.location_title}</div>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Address (Supports HTML)</label>
              {isEditing ? <textarea name="location_address" value={formData.location_address} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm font-mono" /> : <div className="text-sm border border-gray-100 p-3 bg-gray-50 rounded-sm overflow-x-auto whitespace-pre-wrap">{formData.location_address}</div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Contact Number (Viber/Mobile)</label>
                {isEditing ? <input type="text" name="location_phone" value={formData.location_phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm">{formData.location_phone}</p>}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Map Block Title</label>
              {isEditing ? <input type="text" name="location_map_title" value={formData.location_map_title} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm font-bold" /> : <p className="text-sm font-bold">{formData.location_map_title}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Map Block Description</label>
              {isEditing ? <textarea name="location_map_desc" value={formData.location_map_desc} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm">{formData.location_map_desc}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Map Button Text</label>
                {isEditing ? <input type="text" name="location_button_text" value={formData.location_button_text} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm">{formData.location_button_text}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Map Button URL</label>
                {isEditing ? <input type="text" name="location_button_url" value={formData.location_button_url} onChange={handleInputChange} className="w-full px-4 py-2 border border-brand-silver rounded-sm text-sm" /> : <p className="text-sm break-all">{formData.location_button_url}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Site Name */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="site_name"
              value={formData.site_name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-brand-silver rounded-sm focus:ring-1 focus:ring-brand-lavender focus:border-brand-lavender bg-brand-gray/20 text-xs font-black uppercase tracking-[0.2em] font-montserrat"
              placeholder="Enter store name"
            />
          ) : (
            <p className="text-base font-black text-brand-black uppercase font-montserrat">{siteSettings?.site_name?.replace(/ Ph$/i, '')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
