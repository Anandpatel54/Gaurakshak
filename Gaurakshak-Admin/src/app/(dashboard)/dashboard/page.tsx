'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { fetchBookings } from '@/redux/slices/bookingSlice';
import { fetchEvents } from '@/redux/slices/eventSlice';
import { fetchMembers } from '@/redux/slices/memberSlice';
import { fetchMessages } from '@/redux/slices/messageSlice';
import { FiBookOpen, FiCalendar, FiUsers, FiMessageSquare } from 'react-icons/fi';

export default function DashboardOverviewPage() {
  const dispatch = useAppDispatch();
  const { bookings } = useAppSelector((state) => state.bookings);
  const { events } = useAppSelector((state) => state.events);
  const { members } = useAppSelector((state) => state.members);
  const { messages } = useAppSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchBookings());
    dispatch(fetchEvents());
    dispatch(fetchMembers());
    dispatch(fetchMessages());
  }, [dispatch]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const totalEvents = events.length;
  const pendingMembers = members.filter((m) => m.status === 'pending').length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  const stats = [
    { label: 'Pending Bookings', count: pendingBookings, icon: FiBookOpen, color: 'text-orange-500 bg-orange-50 border-orange-100', href: '/bookings' },
    { label: 'Total Events', count: totalEvents, icon: FiCalendar, color: 'text-saffron-500 bg-saffron-50 border-saffron-100', href: '/events' },
    { label: 'Pending Members', count: pendingMembers, icon: FiUsers, color: 'text-yellow-500 bg-yellow-50 border-yellow-100', href: '/members' },
    { label: 'Unread Messages', count: unreadMessages, icon: FiMessageSquare, color: 'text-maroon-500 bg-maroon-50 border-maroon-100', href: '/messages' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
            className="admin-card p-5 sm:p-6 flex items-center justify-between gap-4 hover:scale-102 transition-transform duration-300"
            >
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">{stat.count}</span>
              </div>
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex shrink-0 items-center justify-center border ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="admin-card p-4 sm:p-6 flex flex-col">
          <h3 className="text-base font-bold text-stone-900 mb-5 pb-3 border-b border-stone-100">
            Recent Booking Inquiries
          </h3>
          <div className="space-y-4 grow">
            {bookings.slice(0, 4).map((booking) => (
              <div key={booking._id} className="flex flex-col gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-bold text-stone-900 text-sm">{booking.name}</span>
                  <span className="text-stone-500 text-xs font-semibold break-words">{booking.location} • {booking.kathaType.replace('-', ' ')}</span>
                </div>
                <span className={`w-fit text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                  booking.status === 'pending'
                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                    : booking.status === 'confirmed'
                    ? 'bg-green-50 text-green-600 border border-green-100'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
            {bookings.length === 0 && <p className="text-stone-500 text-xs font-bold text-center">No bookings registered.</p>}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="admin-card p-4 sm:p-6 flex flex-col">
          <h3 className="text-base font-bold text-stone-900 mb-5 pb-3 border-b border-stone-100">
            Upcoming Events List
          </h3>
          <div className="space-y-4 grow">
            {events.filter(e => e.status === 'upcoming').slice(0, 4).map((event) => (
              <div key={event._id} className="flex flex-col gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-bold text-stone-900 text-sm">{event.title}</span>
                  <span className="text-stone-500 text-xs font-semibold break-words">{event.location} • {new Date(event.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
                <span className="w-fit text-[10px] bg-saffron-50 border border-saffron-100 text-saffron-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Upcoming
                </span>
              </div>
            ))}
            {events.length === 0 && <p className="text-stone-500 text-xs font-bold text-center">No events registered.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
