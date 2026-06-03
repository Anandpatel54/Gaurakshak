'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiMapPin, FiPlusCircle } from 'react-icons/fi';
import { bookingService } from '@/services/bookingService';
import { Booking, KathaType } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useClientMounted } from '@/hooks/useClientMounted';
import SectionHeading from '@/components/shared/SectionHeading';

const KATHA_LABELS: Record<KathaType, string> = {
  'bhagavad-katha': 'Bhagavad Katha',
  'ramji-janmotsav': 'Ramji Janmotsav',
  'shiv-mahapuran': 'Shiv Mahapuran',
  'sundarkand-path': 'Sundarkand Path',
  'bhajan-sandhya': 'Bhajan Sandhya',
  other: 'Other devotional program',
};

const STATUS_STYLES: Record<Booking['status'], string> = {
  pending: 'bg-gold-100 text-stone-800 border-gold-500',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Unable to load bookings';
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isMounted = useClientMounted();
  const canLoadBookings = isMounted && isAuthenticated;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const loadBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [isMounted, isAuthenticated, router]);

  if (!canLoadBookings) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
        <p className="text-sm font-bold text-stone-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="My Bookings"
          subtitle="Your submitted katha booking requests will appear here."
          centered={true}
        />

        <div className="mb-8 flex justify-end">
          <Link
            href="/booking"
            className="orange-gradient inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg"
          >
            <FiPlusCircle className="h-5 w-5" />
            New Booking
          </Link>
        </div>

        {loading ? (
          <div className="rounded-lg border border-stone-100 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-bold text-stone-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-bold text-red-700">{error}</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-lg border border-stone-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-50 text-saffron-600">
              <FiCalendar className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-950">No bookings yet</h2>
            <p className="mt-3 text-sm font-semibold text-stone-600">Submit your first katha booking request.</p>
            <Link
              href="/booking"
              className="mt-6 inline-flex rounded-full bg-saffron-600 px-6 py-3 text-sm font-bold text-white hover:bg-saffron-700"
            >
              Book a Katha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {bookings.map((booking) => (
              <article key={booking._id} className="rounded-lg border border-stone-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-saffron-600">Booking ID</p>
                    <h2 className="mt-1 break-all text-lg font-extrabold text-stone-950">{booking._id}</h2>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-extrabold capitalize ${STATUS_STYLES[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-cream-50 p-4">
                    <p className="text-xs font-bold uppercase text-stone-500">Katha Type</p>
                    <p className="mt-1 font-extrabold text-stone-950">{KATHA_LABELS[booking.kathaType]}</p>
                  </div>
                  <div className="rounded-md bg-cream-50 p-4">
                    <p className="text-xs font-bold uppercase text-stone-500">Event Date</p>
                    <p className="mt-1 flex items-center gap-2 font-extrabold text-stone-950">
                      <FiCalendar className="h-4 w-4 text-saffron-600" />
                      {formatDate(booking.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-cream-50 p-4">
                  <p className="text-xs font-bold uppercase text-stone-500">Location</p>
                  <p className="mt-1 flex items-center gap-2 font-extrabold text-stone-950">
                    <FiMapPin className="h-4 w-4 text-saffron-600" />
                    {booking.location}
                  </p>
                </div>

                {booking.notes && (
                  <div className="mt-4 rounded-md border border-stone-100 p-4">
                    <p className="text-xs font-bold uppercase text-stone-500">Notes</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-stone-700">{booking.notes}</p>
                  </div>
                )}

                <p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase text-stone-500">
                  <FiClock className="h-4 w-4" />
                  Submitted {formatDate(booking.createdAt)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
