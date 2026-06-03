'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import { BookingFormData, KathaType } from '@/types';
import SectionHeading from '@/components/shared/SectionHeading';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useClientMounted } from '@/hooks/useClientMounted';
import { FiCalendar, FiLock, FiMapPin, FiSend } from 'react-icons/fi';

const KATHA_TYPES: KathaType[] = [
  'bhagavad-katha',
  'ramji-janmotsav',
  'shiv-mahapuran',
  'sundarkand-path',
  'bhajan-sandhya',
  'other',
];

const KATHA_LABELS: Record<KathaType, string> = {
  'bhagavad-katha': 'Bhagavad Katha',
  'ramji-janmotsav': 'Ramji Janmotsav',
  'shiv-mahapuran': 'Shiv Mahapuran',
  'sundarkand-path': 'Sundarkand Path',
  'bhajan-sandhya': 'Bhajan Sandhya',
  other: 'Other devotional program',
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return 'Error occurred';
};

function LoginRequired() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-saffron-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-saffron-50 text-saffron-600">
        <FiLock className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-extrabold text-stone-950">Login is required for booking</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
        Create an account or log in first. Your booking request will then be saved in the backend.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/login" className="rounded-full bg-saffron-600 px-6 py-3 text-sm font-bold text-white hover:bg-saffron-700">
          Login
        </Link>
        <Link href="/signup" className="rounded-full border border-saffron-200 px-6 py-3 text-sm font-bold text-saffron-700 hover:bg-saffron-50">
          Create Account
        </Link>
      </div>
    </div>
  );
}

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const isMounted = useClientMounted();
  const showBookingForm = isMounted && isAuthenticated && user;
  const initialKathaType = useMemo(() => {
    const type = searchParams.get('type') as KathaType | null;
    return type && KATHA_TYPES.includes(type) ? type : 'bhagavad-katha';
  }, [searchParams]);
  const [formData, setFormData] = useState<Omit<BookingFormData, 'name' | 'phone' | 'email'>>({
    kathaType: initialKathaType,
    eventDate: '',
    location: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  if (!showBookingForm) return <LoginRequired />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventDate || !formData.location) {
      toast.error('Please fill in event date and location');
      return;
    }

    setLoading(true);
    try {
      const response = await bookingService.create({
        ...formData,
        name: showBookingForm.name,
        phone: showBookingForm.phone,
        email: showBookingForm.email,
      });
      toast.success(response.message);
      setFormData({
        kathaType: 'bhagavad-katha',
        eventDate: '',
        location: '',
        notes: '',
      });
      router.push('/my-bookings');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-stone-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
      <div className="mb-8 rounded-lg bg-cream-50 p-4">
        <p className="text-xs font-bold uppercase text-saffron-600">Booking For</p>
        <p className="mt-1 text-lg font-extrabold text-stone-950">{showBookingForm.name}</p>
        <p className="text-sm font-semibold text-stone-600">{showBookingForm.phone} · {showBookingForm.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-700">Katha Type</label>
            <select
              value={formData.kathaType}
              onChange={(e) => setFormData({ ...formData, kathaType: e.target.value as KathaType })}
              className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
            >
              {KATHA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {KATHA_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-stone-700">Event Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-cream-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-stone-700">Location</label>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              required
              placeholder="e.g. Jaipur, Rajasthan"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-lg border border-stone-200 bg-cream-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-stone-700">Additional Notes</label>
          <textarea
            rows={4}
            placeholder="Requirement, estimated attendees or preferred Katha Vachak..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="orange-gradient flex w-full items-center justify-center gap-2 rounded-lg py-4 font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSend className="h-5 w-5" />
          {loading ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Book a Katha / Event"
          subtitle="Log in and submit your katha booking request directly."
          centered={true}
        />

        <Suspense fallback={<div className="text-center font-bold text-stone-600">Loading form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
