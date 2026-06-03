import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/constants/siteConfig';
import { NAV_LINKS } from '@/constants/navigation';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-8 relative overflow-hidden border-t-4 border-saffron-500">
      {/* Decorative background circle */}
      <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-saffron-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-maroon-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 saffron-gold-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
                ॐ
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-saffron-500 tracking-tight leading-none">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase mt-0.5">
                  Spiritual Samiti
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Dedicated to promoting peace, values, and devotion through traditional katha events and cow protection services. Join us in our spiritual journeys.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron-500">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-saffron-500 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron-500">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-saffron-500 shrink-0" />
                <span>{SITE_CONFIG.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-saffron-500 shrink-0" />
                <span>{SITE_CONFIG.email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Devotion */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-saffron-500">
              Gau Sewa Support
            </h3>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Help us in cow protection and running free spiritual centers. Every small contribution creates a holy difference.
            </p>
            <Link
              href="/membership"
              className="inline-block bg-transparent border-2 border-saffron-500 hover:bg-saffron-500 text-saffron-500 hover:text-white px-5 py-2 rounded-full text-sm font-bold transition-all text-center"
            >
              Become a Member
            </Link>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-stone-800 my-10" />

        {/* Bottom footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.fullName}. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://novarsistech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Designed by <span className="text-saffron-500 font-semibold">Novarsis Tech</span>
            </a>
            <Link href="/contact" className="hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:underline">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
