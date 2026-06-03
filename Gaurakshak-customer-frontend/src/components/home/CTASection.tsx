'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiPhone } from 'react-icons/fi';
import { SITE_CONFIG } from '@/constants/siteConfig';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 saffron-gold-gradient opacity-95" />

      {/* Decorative Traditional circle pattern in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-[500px] h-[500px] border-8 border-white rounded-full animate-[spin_100s_linear_infinite]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-white spiritual-text text-lg md:text-xl mb-4 font-bold block"
        >
          May This Bring Auspiciousness
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight"
        >
          Want to Organize a Katha in Your City?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-orange-50 text-base md:text-lg max-w-2xl leading-relaxed font-semibold"
        >
          Get in touch with Gaurakshak Samiti to book or inquire for Shrimad Bhagavad Katha, Ram Katha, Shiv Mahapuran, or Sundarkand Path. Our team handles complete event organization.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/booking"
            className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-extrabold px-8 py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiCalendar className="w-5 h-5 text-saffron-500" /> Book an Inquiry
          </Link>
          <a
            href={`tel:${SITE_CONFIG.phone}`}
            className="w-full sm:w-auto bg-white hover:bg-orange-50 text-saffron-600 font-extrabold px-8 py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <FiPhone className="w-5 h-5 text-saffron-500" /> Call {SITE_CONFIG.phone}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
