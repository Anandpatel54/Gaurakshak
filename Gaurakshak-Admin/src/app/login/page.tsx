'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { loginAdmin } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }
    const resultAction = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(resultAction)) {
      toast.success('Welcome back, Admin!');
      router.replace('/dashboard');
    } else {
      toast.error(resultAction.payload as string || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4">
      <div className="w-full max-w-md bg-stone-950 p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="w-12 h-12 bg-gradient-to-tr from-saffron-500 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
          ॐ
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight mb-2">Gaurakshak Admin</h1>
        <p className="text-xs text-stone-400 font-bold mb-8 uppercase tracking-widest">Management Portal</p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@gaurakshak.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
              />
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 w-4 h-4" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-600 focus:outline-none focus:border-saffron-500 text-sm font-semibold"
              />
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-saffron-500 to-gold-500 hover:from-saffron-600 hover:to-gold-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-stone-600 font-semibold leading-relaxed">
          Demo Credentials:<br />
          Email: <span className="text-stone-500">admin@gaurakshak.com</span><br />
          Password: <span className="text-stone-500">admin123</span>
        </div>
      </div>
    </div>
  );
}
