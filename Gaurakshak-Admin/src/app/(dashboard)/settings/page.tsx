'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

export default function SettingsAdminPage() {
  const [siteInfo, setSiteInfo] = useState({
    name: 'Gaurakshak Samiti',
    tagline: 'धर्म की सेवा में समर्पित',
    phone: '+91 98765 43210',
    email: 'info@gaurakshak.com',
    whatsapp: '+919876543210',
    address: 'Gaurakshak Samiti Bhawan, Main Road, India',
    facebook: 'https://facebook.com/gaurakshak',
    instagram: 'https://instagram.com/gaurakshak',
    youtube: 'https://youtube.com/gaurakshak',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save delay
    await new Promise((res) => setTimeout(res, 800));
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSiteSettings', JSON.stringify(siteInfo));
    }
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminSiteSettings');
    }
    setSiteInfo({
      name: 'Gaurakshak Samiti',
      tagline: 'धर्म की सेवा में समर्पित',
      phone: '+91 98765 43210',
      email: 'info@gaurakshak.com',
      whatsapp: '+919876543210',
      address: 'Gaurakshak Samiti Bhawan, Main Road, India',
      facebook: 'https://facebook.com/gaurakshak',
      instagram: 'https://instagram.com/gaurakshak',
      youtube: 'https://youtube.com/gaurakshak',
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8">
      {/* Site Information */}
      <div className="admin-card p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
          Site Information
        </h3>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Samiti Name</label>
              <input
                type="text"
                value={siteInfo.name}
                onChange={(e) => setSiteInfo({ ...siteInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Tagline (Hindi)</label>
              <input
                type="text"
                value={siteInfo.tagline}
                onChange={(e) => setSiteInfo({ ...siteInfo, tagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Address</label>
            <textarea
              rows={2}
              value={siteInfo.address}
              onChange={(e) => setSiteInfo({ ...siteInfo, address: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="admin-card p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Phone Number</label>
            <input
              type="text"
              value={siteInfo.phone}
              onChange={(e) => setSiteInfo({ ...siteInfo, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={siteInfo.email}
              onChange={(e) => setSiteInfo({ ...siteInfo, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">WhatsApp Number</label>
            <input
              type="text"
              value={siteInfo.whatsapp}
              onChange={(e) => setSiteInfo({ ...siteInfo, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="admin-card p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Facebook URL</label>
            <input
              type="text"
              value={siteInfo.facebook}
              onChange={(e) => setSiteInfo({ ...siteInfo, facebook: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Instagram URL</label>
            <input
              type="text"
              value={siteInfo.instagram}
              onChange={(e) => setSiteInfo({ ...siteInfo, instagram: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">YouTube URL</label>
            <input
              type="text"
              value={siteInfo.youtube}
              onChange={(e) => setSiteInfo({ ...siteInfo, youtube: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:border-saffron-500 text-sm font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-4">
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-6 py-3 rounded-xl font-bold text-sm transition-all sm:w-auto"
        >
          <FiRefreshCw className="w-4 h-4" /> Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all sm:w-auto"
        >
          <FiSave className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
