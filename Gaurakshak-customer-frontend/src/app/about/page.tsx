'use client';

import React from 'react';
import Image from 'next/image';
import SectionHeading from '@/components/shared/SectionHeading';
import { committeeMembers } from '@/data/committeeMembers';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100 mb-16"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-saffron-500 spiritual-text text-lg block mb-2 font-bold">Service Is the Highest Dharma</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-6">About Gaurakshak Samiti</h1>
            <p className="text-stone-600 text-base md:text-lg leading-relaxed font-medium">
              Established with the vision of promoting Gau Sewa (Cow protection) and preserving the rich spiritual traditions of Sanatan Dharma, Gaurakshak Samiti has been organizing grand religious events for over a decade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Our History & Legacy</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-4 font-semibold">
                What started as a small group of devotees serving stray cows has now grown into a dedicated samiti managing multiple gaushalas and organizing massive, city-wide spiritual discourses including Shrimad Bhagavad Katha and Ram Katha.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed font-semibold">
                Through our transparent and service-oriented approach, we ensure that every rupee donated goes directly towards the fodder, medical care of cows, and setting up high-quality katha pandals for thousands of devotees.
              </p>
            </div>
            <div className="relative h-72 w-full rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80&w=800"
                alt="Legacy and cow protection"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
          >
            <h2 className="text-2xl font-bold text-saffron-600 mb-4">Our Mission</h2>
            <p className="text-stone-600 text-sm leading-relaxed font-medium">
              To spread peace, harmony, and spiritual alignment through devotional kathas while providing sustainable shelter, care, and protection to cows across the country.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100"
          >
            <h2 className="text-2xl font-bold text-saffron-600 mb-4">Our Vision</h2>
            <p className="text-stone-600 text-sm leading-relaxed font-medium">
              To build a society rooted in spiritual wisdom where every individual respects nature, cares for animals, and lives a life of selfless devotion and high moral character.
            </p>
          </motion.div>
        </div>

        {/* Committee Members */}
        <SectionHeading
          title="Our Executive Committee"
          subtitle="Meet the pillars of Gaurakshak Samiti who lead our social and religious activities."
          centered={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {committeeMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 text-center flex flex-col items-center hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-full bg-saffron-100 text-saffron-600 flex items-center justify-center font-bold text-2xl mb-4">
                {member.name[4] || member.name[0]}
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-1">{member.name}</h3>
              <span className="text-xs text-saffron-600 font-extrabold uppercase tracking-wide mb-3 block">{member.role}</span>
              <p className="text-stone-500 text-xs leading-relaxed font-medium">
                {member.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
