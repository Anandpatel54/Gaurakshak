'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiEyeOff, FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { login, clearError } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useClientMounted } from '@/hooks/useClientMounted';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const isMounted = useClientMounted();

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.replace('/profile');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/profile');
    }
  };

  return (
    <div className="bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-saffron-100 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <div className="maroon-gradient flex min-h-105 flex-col justify-between p-8 text-white sm:p-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold text-saffron-600">
              ॐ
            </span>
            <span className="text-2xl font-extrabold">Gaurakshak</span>
          </Link>

          <div>
            <p className="mb-3 text-sm font-bold uppercase text-gold-100">Member Login</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Log in to your account</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-cream-100">
              After logging in, you can submit katha bookings and membership plan requests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-cream-100">
            <span className="rounded-md bg-white/10 px-4 py-3">Secure account</span>
            <span className="rounded-md bg-white/10 px-4 py-3">Booking access</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase text-saffron-600">Welcome Back</p>
            <h2 className="mt-2 text-3xl font-extrabold text-stone-950">Login</h2>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-stone-200 bg-cream-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:border-saffron-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full rounded-lg border border-stone-200 bg-cream-50 py-3 pl-12 pr-12 text-sm font-semibold outline-none transition focus:border-saffron-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 rounded-full p-2 -translate-y-1/2 text-stone-500 hover:bg-saffron-50 hover:text-saffron-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="orange-gradient flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiLogIn className="h-5 w-5" />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-stone-600">
            Do not have an account?{' '}
            <Link href="/signup" className="text-saffron-600 hover:text-saffron-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
