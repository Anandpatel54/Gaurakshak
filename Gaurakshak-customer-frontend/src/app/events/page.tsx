'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchEvents } from '@/redux/slices/eventSlice';
import SectionHeading from '@/components/shared/SectionHeading';
import { FiCalendar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getMediaUrl } from '@/utils/media';

const EVENT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=600';

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const filters: Array<typeof filter> = ['all', 'upcoming', 'completed'];

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  return (
    <div className="py-12 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Spiritual Events Calendar"
          subtitle="Join us in our upcoming and past katha assemblies, devotional events, and regular services."
          centered={true}
        />

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {filters.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
                filter === type
                  ? 'saffron-gold-gradient text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {type} Events
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl p-8 border border-saffron-100 max-w-lg mx-auto">
            <p className="text-stone-600 font-medium mb-4">No events found matching this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={getMediaUrl(event.image, EVENT_FALLBACK_IMAGE)}
                    alt={event.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-saffron-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-md">
                    {event.kathaType.replace('-', ' ')}
                  </div>
                  {event.status === 'completed' && (
                    <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
                      <span className="bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-white/20">
                        Completed
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-stone-900 mb-3 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-stone-600 text-xs mb-6 line-clamp-2 leading-relaxed font-semibold">
                    {event.description}
                  </p>

                  <div className="mt-auto space-y-2.5 border-t border-stone-100 pt-4 text-xs font-bold text-stone-600">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-saffron-500 w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <FiClock className="text-saffron-500 w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-saffron-500 w-4 h-4 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                    {event.vachak && (
                      <div className="flex items-center gap-2">
                        <div className="relative w-7 h-7 overflow-hidden rounded-full border border-saffron-100">
                          <Image
                            src={getMediaUrl(event.vachak.photo, EVENT_FALLBACK_IMAGE)}
                            alt={event.vachak.name}
                            fill
                            unoptimized
                            sizes="28px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-stone-800 line-clamp-1">{event.vachak.name}</span>
                      </div>
                    )}
                    {event.status === 'upcoming' && (
                      <Link
                        href="/booking"
                        className="text-saffron-600 hover:text-saffron-700 font-bold text-xs flex items-center gap-1 hover:underline ml-auto"
                      >
                        Book Now <FiArrowRight className="w-3.5 h-3.5" />
                      </Link>
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
