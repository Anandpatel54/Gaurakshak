'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchEvents } from '@/redux/slices/eventSlice';
import SectionHeading from '../shared/SectionHeading';
import { FiCalendar, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getMediaUrl } from '@/utils/media';

const EVENT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=600';

export default function UpcomingKathas() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const upcomingEvents = events
    .filter((event) => event.status === 'upcoming')
    .slice(0, 3);

  return (
    <section className="py-20 bg-cream-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Upcoming Kathas & Festivals"
          subtitle="Be part of our divine events and experiences. Check out our upcoming calendar details below."
          spiritual={true}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-96 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl p-8 border border-saffron-100 max-w-lg mx-auto">
            <p className="text-stone-600 font-medium mb-4">No upcoming events listed at the moment.</p>
            <Link href="/contact" className="text-saffron-500 font-bold hover:underline">Inquire for future bookings</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-stone-100"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full">
                  <Image
                    src={getMediaUrl(event.image, EVENT_FALLBACK_IMAGE)}
                    alt={event.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-saffron-500 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-md">
                    {event.kathaType.replace('-', ' ')}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-bold text-stone-900 mb-3 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-stone-600 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                    {event.description}
                  </p>

                  <div className="mt-auto space-y-3 border-t border-stone-100 pt-4 text-xs font-semibold text-stone-700">
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
                        <Image
                          src={getMediaUrl(event.vachak.photo, EVENT_FALLBACK_IMAGE)}
                          alt={event.vachak.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover border border-saffron-100"
                        />
                        <span className="text-xs font-bold text-stone-800 line-clamp-1">{event.vachak.name}</span>
                      </div>
                    )}
                    <Link
                      href="/booking"
                      className="text-saffron-600 hover:text-saffron-700 font-bold text-sm flex items-center gap-1 hover:underline ml-auto"
                    >
                      Book Now <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/events"
            className="inline-block bg-transparent hover:bg-saffron-500 text-saffron-600 hover:text-white border-2 border-saffron-500 font-bold px-8 py-3.5 rounded-full shadow-sm transition-all"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
