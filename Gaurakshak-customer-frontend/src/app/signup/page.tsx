'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FiEye, FiEyeOff, FiLock, FiMail, FiMapPin, FiPhone, FiUser, FiUserPlus } from 'react-icons/fi';
import { signup, clearError } from '@/redux/slices/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useClientMounted } from '@/hooks/useClientMounted';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const isMounted = useClientMounted();

  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.replace('/profile');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const nextValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
    if (error) dispatch(clearError());
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const phone = formData.phone.replace(/\D/g, '');

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Enter a valid email address';
    if (phone.length !== 10) errors.phone = 'Enter a valid 10 digit phone number';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) errors.agreeToTerms = 'Please confirm your account details';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      address: formData.address.trim(),
      city: formData.city.trim(),
    };

    const result = await dispatch(signup(submitData));
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/');
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-cream-50 py-3 pl-12 pr-4 text-sm font-semibold outline-none transition focus:bg-white ${
      validationErrors[field] ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-saffron-500'
    }`;

  return (
    <div className="bg-cream-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-saffron-100 bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
        <div className="saffron-gold-gradient flex min-h-130 flex-col justify-between p-8 text-white sm:p-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-bold text-saffron-600">
              ॐ
            </span>
            <span className="text-2xl font-extrabold">Gaurakshak</span>
          </Link>

          <div>
            <p className="mb-3 text-sm font-bold uppercase">Create Account</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Join the Gaurakshak community</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/90">
              Once your account is created, you can submit booking requests and membership plan requests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
            <span className="rounded-md bg-white/18 px-4 py-3">Fast signup</span>
            <span className="rounded-md bg-white/18 px-4 py-3">Member access</span>
          </div>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase text-saffron-600">New Member</p>
            <h2 className="mt-2 text-3xl font-extrabold text-stone-950">Sign Up</h2>
          </div>

          {error && (
            <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input id="name" name="name" value={formData.name} onChange={handleChange} className={inputClass('name')} />
              </div>
              {validationErrors.name && <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.name}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass('phone')} />
              </div>
              {validationErrors.phone && <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.phone}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass('email')} />
              </div>
              {validationErrors.email && <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                City
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
                <input id="city" name="city" value={formData.city} onChange={handleChange} className={inputClass('city')} />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Address
              </label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-stone-200 bg-cream-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-saffron-500 focus:bg-white"
              />
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
                  className={`${inputClass('password')} pr-12`}
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
              {validationErrors.password && <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-xs font-bold uppercase text-stone-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-cream-50 px-4 py-3 text-sm font-semibold outline-none transition focus:bg-white ${
                  validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-stone-200 focus:border-saffron-500'
                }`}
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-3 text-sm font-semibold text-stone-600">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-saffron-600"
                />
                I confirm that my account details are correct.
              </label>
              {validationErrors.agreeToTerms && (
                <p className="mt-1 text-xs font-semibold text-red-600">{validationErrors.agreeToTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="orange-gradient flex items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              <FiUserPlus className="h-5 w-5" />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-semibold text-stone-600">
            Already have an account?{' '}
            <Link href="/login" className="text-saffron-600 hover:text-saffron-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
