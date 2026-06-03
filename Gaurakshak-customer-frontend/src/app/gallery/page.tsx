'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchGallery } from '@/redux/slices/gallerySlice';
import SectionHeading from '@/components/shared/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEye } from 'react-icons/fi';

export default function GalleryPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.gallery);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(items.map((item) => item.category.toLowerCase())))];

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category.toLowerCase() === activeCategory;
  });

  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Gaurakshak Media Gallery"
          subtitle="Explore photos and highlight moments of our divine events, daily rituals, and Gau Sewa activities."
          centered={true}
        />

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all border ${
                activeCategory === category
                  ? 'saffron-gold-gradient text-white border-transparent shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-64 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl p-8 border border-saffron-100 max-w-lg mx-auto">
            <p className="text-stone-600 font-medium">No items found under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => setLightboxImage(item.url)}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-saffron-400 font-bold text-xs uppercase tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center backdrop-blur-sm">
                    <FiEye className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all focus:outline-none"
            >
              <FiX className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={lightboxImage}
                alt="Enlarged gallery glimpse"
                className="max-w-full max-h-[85vh] object-contain mx-auto"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
