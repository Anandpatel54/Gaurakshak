'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/redux/slices/authSlice';
import { toast } from 'react-hot-toast';
import {
  FiGrid,
  FiCalendar,
  FiBookOpen,
  FiImage,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiUser,
  FiMic,
  FiMenu,
  FiX
} from 'react-icons/fi';

const SIDEBAR_LINKS = [
  { label: 'Overview', href: '/dashboard', icon: FiGrid },
  { label: 'Bookings', href: '/bookings', icon: FiBookOpen },
  { label: 'Events', href: '/events', icon: FiCalendar },
  { label: 'Katha Vachak', href: '/katha-vachak', icon: FiMic },
  { label: 'Gallery', href: '/gallery', icon: FiImage },
  { label: 'Members', href: '/members', icon: FiUsers },
  { label: 'Messages', href: '/messages', icon: FiMessageSquare },
  { label: 'Settings', href: '/settings', icon: FiSettings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { isAuthenticated, admin } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const mountFrame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(mountFrame);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#F8F9FB]">
        <div className="text-stone-500 font-bold animate-pulse text-sm">Authenticating...</div>
      </div>
    );
  }

  const pageTitle = pathname.replace('/', '').replace('-', ' ') || 'Dashboard';

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 border-b border-stone-800 pb-5">
          <div className="w-8 h-8 bg-gradient-to-tr from-saffron-500 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            ॐ
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-sm tracking-tight leading-none">Gaurakshak Admin</span>
            <span className="text-[9px] text-stone-500 font-bold uppercase mt-1">Management Portal</span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1.5">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-saffron-500 text-white shadow-md'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer actions */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-sm font-semibold transition-all w-full text-left"
      >
        <FiLogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>
    </>
  );

  return (
    <div className="flex min-h-dvh bg-[#F8F9FB] lg:h-screen lg:overflow-hidden">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside className="hidden w-64 admin-sidebar lg:flex flex-col justify-between p-6 shrink-0 border-r border-stone-800">
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[82vw] max-w-72 admin-sidebar flex flex-col justify-between p-5 border-r border-stone-800 transition-transform duration-300 lg:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-stone-300"
        >
          <FiX className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 flex justify-between items-center shrink-0 sticky top-0 z-30 lg:static">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 lg:hidden"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h2 className="truncate text-stone-900 font-bold text-base sm:text-lg capitalize">
              {pageTitle}
            </h2>
          </div>

          {/* User Info */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 flex-col items-end sm:flex">
              <span className="max-w-36 truncate text-stone-800 font-bold text-sm leading-none">{admin?.name || 'Administrator'}</span>
              <span className="max-w-44 truncate text-stone-400 text-[10px] font-bold mt-1 uppercase tracking-wider">{admin?.email}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 border border-stone-200 shrink-0">
              <FiUser className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
