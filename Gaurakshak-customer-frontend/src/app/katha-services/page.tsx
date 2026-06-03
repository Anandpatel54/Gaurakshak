'use client';

import React from 'react';
import Link from 'next/link';
import { KATHA_TYPES } from '@/constants/kathaTypes';
import SectionHeading from '@/components/shared/SectionHeading';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';

export default function KathaServicesPage() {
  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="All Katha Services"
          subtitle="Explore the range of spiritual events organized by Gaurakshak Samiti. Select one to book an inquiry."
          centered={true}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {KATHA_TYPES.map((katha, idx) => (
            <motion.div
              key={katha.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all relative"
            >
              {/* Saffron border marker */}
              <div
                className="h-2 w-full"
                style={{ backgroundColor: katha.color }}
              />

              <div className="p-8 flex-grow flex flex-col">
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

                <span className="text-saffron-500 spiritual-text text-xs font-semibold mb-1">{katha.titleHindi}</span>
                <h2 className="text-xl font-bold text-stone-900 mb-4">{katha.title}</h2>
                <p className="text-stone-600 text-sm leading-relaxed mb-8 flex-grow font-medium">
                  {katha.description}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    href={`/booking?type=${katha.id}`}
                    className="w-full text-center block bg-saffron-500 hover:bg-saffron-600 text-white py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Book This Katha
                  </Link>
                  <Link
                    href="/contact"
                    className="w-full text-center block bg-stone-50 hover:bg-stone-100 text-stone-700 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
