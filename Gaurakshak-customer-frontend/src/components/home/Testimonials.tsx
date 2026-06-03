'use client';

import React from 'react';
import { testimonials } from '@/data/testimonials';
import SectionHeading from '../shared/SectionHeading';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function Testimonials() {
  return (
    <section className="py-20 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Devotees Say"
          subtitle="Real reviews and feedback from people who attended our spiritual katha sessions and seva programs."
          spiritual={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col relative"
            >
              {/* Quote Icon */}
              <FaQuoteLeft className="text-saffron-500/10 text-5xl absolute top-6 right-8" />

              {/* Rating stars */}
              <div className="flex gap-1 mb-6 text-gold-500">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar key={i} className="w-4 h-4" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-stone-600 text-sm leading-relaxed mb-8 grow font-medium italic">
                &quot;{item.text}&quot;
              </p>

              {/* Devotee Info */}
              <div className="flex items-center gap-4 border-t border-stone-100 pt-6 mt-auto">
                <div className="w-10 h-10 saffron-gold-gradient rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                  <span className="text-xs text-stone-400 font-semibold">{item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
