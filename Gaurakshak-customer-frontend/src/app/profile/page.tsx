'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useClientMounted } from '@/hooks/useClientMounted';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const isMounted = useClientMounted();
  const showProfile = isMounted && isAuthenticated && user;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  if (!showProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Welcome to the Gaurakshak community</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-orange-600 to-red-600 px-8 py-12">
            <div className="flex items-center space-x-6">
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                👤
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold">{showProfile.name}</h2>
                <p className="text-orange-100">Member</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Details</h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="pb-6 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Email Address
                </label>
                <p className="text-lg text-gray-900 mt-1">{showProfile.email}</p>
              </div>

              {/* Phone */}
              <div className="pb-6 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Phone Number
                </label>
                <p className="text-lg text-gray-900 mt-1">{showProfile.phone}</p>
              </div>

              {/* Member ID */}
              <div className="pb-6 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Member ID
                </label>
                <p className="text-lg text-gray-900 mt-1 font-mono">{showProfile.id}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/edit-profile"
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition duration-200"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/booking"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 text-center"
          >
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-semibold text-gray-900">Booking</h3>
            <p className="text-sm text-gray-600 mt-1">Book a Katha</p>
          </Link>

          <Link
            href="/my-bookings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 text-center"
          >
            <div className="text-4xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900">My Bookings</h3>
            <p className="text-sm text-gray-600 mt-1">View booking status</p>
          </Link>

          <Link
            href="/events"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-semibold text-gray-900">Events</h3>
            <p className="text-sm text-gray-600 mt-1">Upcoming events</p>
          </Link>

          <Link
            href="/membership"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 text-center"
          >
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="font-semibold text-gray-900">Membership</h3>
            <p className="text-sm text-gray-600 mt-1">Membership plans</p>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
