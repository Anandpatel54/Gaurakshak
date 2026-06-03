'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchGallery } from '@/redux/slices/gallerySlice';
import SectionHeading from '../shared/SectionHeading';
import { motion } from 'framer-motion';
import { FiEye } from 'react-icons/fi';

export default function GalleryPreview() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  const highlightItems = items.slice(0, 4);

  return (
    <section className="py-20 bg-cream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Glimpses of Divine Events"
          subtitle="A look at our past Katha programs, Gau Sewa initiatives, and festival highlights."
          spiritual={false}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-64 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : highlightItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl p-8 border border-saffron-100 max-w-lg mx-auto">
            <p className="text-stone-600 font-medium">No gallery items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlightItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative group h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-saffron-400 font-bold text-xs uppercase tracking-wider mb-1">{item.category}</span>
                  <h3 className="text-white font-bold text-base line-clamp-1">{item.title}</h3>
                  <Link
                    href="/gallery"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
                  >
                    <div className="w-12 h-12 rounded-full bg-saffron-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <FiEye className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-block bg-saffron-500 hover:bg-saffron-600 text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-all"
          >
            Explore Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
