'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { kathaVachakService } from '@/services/kathaVachakService';
import { KathaVachak } from '@/types';
import SectionHeading from '@/components/shared/SectionHeading';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { getMediaUrl } from '@/utils/media';

const VachakFallbackImage = 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=800';

export default function KathaVachakPage() {
  const [vachaks, setVachaks] = useState<KathaVachak[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    kathaVachakService
      .getAll()
      .then((res) => {
        setVachaks(res.data);
        setError('');
      })
      .catch(() => {
        setError('Unable to load Katha Vachaks right now.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Revered Katha Vachaks"
          subtitle="Learn about the spiritual masters and speakers who lead our sacred discourses."
          centered={true}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-[450px] animate-pulse shadow-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-3xl p-8 border border-red-100 max-w-lg mx-auto">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        ) : vachaks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl p-8 border border-saffron-100 max-w-lg mx-auto">
            <p className="text-stone-600 font-medium">No Katha Vachaks are listed at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vachaks.map((vachak, idx) => (
              <motion.div
                key={vachak._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all"
              >
                {/* Photo Header */}
                <div className="relative h-64 w-full bg-stone-100">
                  <Image
                    src={getMediaUrl(vachak.photo, VachakFallbackImage)}
                    alt={vachak.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-sm text-gold-500 font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 border border-stone-800">
                    <FiBriefcase className="w-3.5 h-3.5" /> {vachak.experience} Experience
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{vachak.name}</h3>

                  {/* Specializations tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {vachak.specialization.map((spec) => (
                      <span key={spec} className="bg-saffron-50 text-saffron-600 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6 font-medium line-clamp-4">
                    {vachak.bio}
                  </p>

                  <div className="mt-auto space-y-2 border-t border-stone-100 pt-5 text-xs font-semibold text-stone-500">
                    {vachak.location && (
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-saffron-500 w-4 h-4" />
                        <span>{vachak.location}</span>
                      </div>
                    )}
                    {vachak.phone && (
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-saffron-500 w-4 h-4" />
                        <span>{vachak.phone}</span>
                      </div>
                    )}
                    {vachak.email && (
                      <div className="flex items-center gap-2">
                        <FiMail className="text-saffron-500 w-4 h-4" />
                        <span>{vachak.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
