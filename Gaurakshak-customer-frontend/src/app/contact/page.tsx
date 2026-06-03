'use client';

import React, { useState } from 'react';
import { contactService } from '@/services/contactService';
import { ContactFormData } from '@/types';
import { SITE_CONFIG } from '@/constants/siteConfig';
import SectionHeading from '@/components/shared/SectionHeading';
import { toast } from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin, FiMessageSquare } from 'react-icons/fi';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields (*)');
      return;
    }
    setLoading(true);
    try {
      const response = await contactService.create(formData);
      if (response.success) {
        toast.success(response.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error occurred';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Contact Gaurakshak Samiti"
          subtitle="Get in touch with us for general inquiries, donations, volunteer support or event coordination details."
          centered={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
          {/* Contact details card */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm space-y-8 lg:col-span-1">
            <h3 className="text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">Our Contact Details</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1">Our Address</span>
                  <p className="text-stone-800 text-sm font-semibold leading-relaxed">{SITE_CONFIG.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1">Phone Number</span>
                  <p className="text-stone-800 text-sm font-semibold">{SITE_CONFIG.phone}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider block mb-1">Email Address</span>
                  <p className="text-stone-800 text-sm font-semibold">{SITE_CONFIG.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form card */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-stone-100 shadow-sm lg:col-span-2">
            <h3 className="text-xl font-bold text-stone-900 mb-8 flex items-center gap-2">
              <FiMessageSquare className="text-saffron-500" /> Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Subject of message"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto orange-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
