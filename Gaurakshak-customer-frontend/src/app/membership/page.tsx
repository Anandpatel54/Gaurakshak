'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { memberService } from '@/services/memberService';
import { MemberFormData } from '@/types';
import SectionHeading from '@/components/shared/SectionHeading';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiCheckCircle, FiLock, FiSend } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useClientMounted } from '@/hooks/useClientMounted';

type MembershipType = MemberFormData['membershipType'];

const PLANS: Array<{
  type: MembershipType;
  name: string;
  price: string;
  benefits: string[];
  color: string;
}> = [
  {
    type: 'basic',
    name: 'Gau Mitra (Basic)',
    price: 'Rs. 500 / month',
    benefits: ['Access to daily digital satsangs', 'Invitation to standard katha events', 'Monthly digital newsletter updates'],
    color: '#FF8C00',
  },
  {
    type: 'silver',
    name: 'Gau Sevak (Silver)',
    price: 'Rs. 1,100 / month',
    benefits: ['All Basic plan benefits', 'Preferred seating at city-wide Kathas', 'Annual Special Gau Puja invitation'],
    color: '#F5C518',
  },
  {
    type: 'gold',
    name: 'Gau Rakshak (Gold)',
    price: 'Rs. 2,500 / month',
    benefits: ['All Silver plan benefits', 'Family mention in Katha prayers', 'Stay options at Samiti Ashram centers'],
    color: '#FF6B00',
  },
  {
    type: 'platinum',
    name: 'Samiti Patron (Platinum)',
    price: 'Rs. 5,000 / month',
    benefits: ['All Gold plan benefits', 'VIP seating for all events', 'One-on-one session with visiting Katha Vachaks'],
    color: '#800020',
  },
];

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
      <h2 className="text-2xl font-extrabold text-stone-950">Login is required for membership</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-stone-600">
        Create an account or log in first. Your membership request will be attached to your profile.
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

export default function MembershipPage() {
  const { user, isAuthenticated } = useAuth();
  const isMounted = useClientMounted();
  const showMemberForm = isMounted && isAuthenticated && user;
  const [formData, setFormData] = useState<Pick<MemberFormData, 'address' | 'city' | 'membershipType'>>({
    address: '',
    city: '',
    membershipType: 'basic',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showMemberForm) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await memberService.updateMyMembership(formData);
      toast.success(response.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Samiti Membership Programs"
          subtitle="Log in, choose a membership plan, and save your request in the backend."
          centered={true}
        />

        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, idx) => {
            const isSelected = formData.membershipType === plan.type;
            return (
              <motion.div
                key={plan.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`relative flex flex-col overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition ${
                  isSelected ? 'border-saffron-500 ring-2 ring-saffron-100' : 'border-stone-100'
                }`}
              >
                <div className="absolute left-0 right-0 top-0 h-2" style={{ backgroundColor: plan.color }} />
                <h3 className="mt-3 text-lg font-extrabold text-stone-950">{plan.name}</h3>
                <span className="mt-2 block text-xl font-extrabold text-saffron-600">{plan.price}</span>

                <ul className="my-6 grow space-y-4">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-xs font-semibold leading-relaxed text-stone-600">
                      <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setFormData({ ...formData, membershipType: plan.type })}
                  className={`w-full rounded-lg py-2.5 text-xs font-bold transition ${
                    isSelected ? 'bg-saffron-600 text-white' : 'bg-stone-50 text-stone-700 hover:bg-saffron-500 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Choose Plan'}
                </button>
              </motion.div>
            );
          })}
        </div>

        {!showMemberForm ? (
          <LoginRequired />
        ) : (
          <div className="mx-auto max-w-3xl rounded-lg border border-stone-100 bg-white p-6 shadow-sm sm:p-8 md:p-10">
            <div className="mb-8 rounded-lg bg-cream-50 p-4">
              <p className="text-xs font-bold uppercase text-saffron-600">Membership For</p>
              <p className="mt-1 text-lg font-extrabold text-stone-950">{user.name}</p>
              <p className="text-sm font-semibold text-stone-600">{user.phone} · {user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-stone-700">Selected Plan</label>
                  <select
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as MembershipType })}
                    className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
                  >
                    {PLANS.map((plan) => (
                      <option key={plan.type} value={plan.type}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase text-stone-700">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-stone-700">Postal Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none focus:border-saffron-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="orange-gradient flex w-full items-center justify-center gap-2 rounded-lg py-4 font-bold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiSend className="h-5 w-5" />
                {loading ? 'Submitting...' : 'Submit Membership Request'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
