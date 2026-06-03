import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function WhatsAppFloat() {
  // Format WhatsApp number to link format
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 hover:shadow-green-500/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
    >
      <FaWhatsapp className="w-7 h-7" />
      <span className="absolute right-full mr-3 bg-white text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:inline border border-stone-100">
        Chat with Us
      </span>
    </a>
  );
}
