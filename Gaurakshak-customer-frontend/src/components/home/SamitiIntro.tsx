'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SamitiIntro() {
  return (
    <section className="py-20 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid with overlapping cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-120 w-full"
          >
            <div className="absolute inset-0 bg-saffron-100 rounded-3xl -rotate-3 scale-95" />
            <Image
              src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800"
              alt="Gau Sewa"
              fill
              className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-lg"
            />
            {/* Embedded Badge Info Card */}
            <div className="absolute -bottom-6 -right-6 glass-panel border border-saffron-100 p-6 rounded-2xl shadow-xl flex flex-col max-w-60 text-stone-800">
              <span className="text-3xl font-extrabold text-saffron-500">100%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-maroon-500 mt-1">Spiritual Integrity</span>
              <span className="text-stone-600 text-xs mt-2 leading-relaxed font-medium">Protecting sacred cows and spreading spiritual stories.</span>
            </div>
          </motion.div>

          {/* Text Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <span className="text-saffron-500 font-extrabold text-sm uppercase tracking-widest spiritual-text">
              Dedicated to Sacred Service
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              About Gaurakshak Samiti & Our Holy Mission
            </h2>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed font-medium">
              Gaurakshak Samiti is a religious and social organization dedicated to the service of holy cows (Gau Sewa) and managing grand katha festivals like Shrimad Bhagavad Katha, Ramji Janmotsav, and Shiv Mahapuran.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed font-semibold">
              Our samiti works tirelessly to make spiritual discourses accessible, setup sustainable gaushalas, and ensure the ancient values of Sanatan Dharma are carried forward to the next generation.
            </p>

            <div className="grid grid-cols-2 gap-6 my-4">
              <div className="flex flex-col border-l-4 border-saffron-500 pl-4">
                <span className="text-2xl font-bold text-stone-900">50+</span>
                <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Kathas Managed</span>
              </div>
              <div className="flex flex-col border-l-4 border-saffron-500 pl-4">
                <span className="text-2xl font-bold text-stone-900">5000+</span>
                <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Devotees Served</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="orange-gradient text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-102 transition-all"
              >
                Read More About Us
              </Link>
              <Link
                href="/membership"
                className="bg-transparent hover:bg-stone-100 text-stone-800 border-2 border-stone-300 px-8 py-3.5 rounded-full text-sm font-bold transition-all"
              >
                Join As Member
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
