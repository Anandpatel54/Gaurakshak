'use client';

import React from 'react';
import Link from 'next/link';
import { KATHA_TYPES } from '@/constants/kathaTypes';
import SectionHeading from '../shared/SectionHeading';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

export default function KathaServices() {
  return (
    <section className="py-20 bg-cream-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Spiritual Katha Services"
          subtitle="Explore the various types of Katha programs and spiritual events organized by Gaurakshak Samiti. Select one to book an inquiry."
          spiritual={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {KATHA_TYPES.map((katha, idx) => (
            <motion.div
              key={katha.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 hover:shadow-xl hover:border-saffron-100 transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {/* Top border decoration */}
              <div 
                className="absolute top-0 left-0 right-0 h-2 transition-all duration-300 group-hover:h-3"
                style={{ backgroundColor: katha.color }}
              />

              {/* Icon & Title */}
              <div className="flex items-center justify-between mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: `${katha.color}15`, color: katha.color }}
                >
                  {katha.icon}
                </div>
                <span className="text-stone-400 font-extrabold text-xs tracking-wider uppercase bg-stone-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5" /> {katha.duration}
                </span>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <span className="text-saffron-500 spiritual-text text-xs font-semibold">{katha.titleHindi}</span>
                <h3 className="text-xl font-bold text-stone-900 group-hover:text-saffron-600 transition-colors">
                  {katha.title}
                </h3>
              </div>

              <p className="text-stone-600 text-sm leading-relaxed mb-8 flex-grow font-medium">
                {katha.description}
              </p>

              <div className="mt-auto pt-6 border-t border-stone-100">
                <Link
                  href={`/booking?type=${katha.id}`}
                  className="w-full text-center block bg-stone-50 hover:bg-saffron-500 hover:text-white text-stone-700 py-3 rounded-xl font-bold text-sm transition-all duration-300"
                >
                  Inquire Now
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
