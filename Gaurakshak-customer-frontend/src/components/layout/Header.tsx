'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants/navigation';
import { SITE_CONFIG } from '@/constants/siteConfig';
import { FiCalendar, FiChevronDown, FiLogOut, FiMenu, FiPhone, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useClientMounted } from '@/hooks/useClientMounted';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMounted = useClientMounted();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const showAuthenticatedUser = isMounted && isAuthenticated && user;
  const desktopLinks = useMemo(() => NAV_LINKS.filter((link) => link.href !== '/booking'), []);
  const primaryLinks = desktopLinks.slice(0, 5);
  const secondaryLinks = desktopLinks.slice(5);
  const isLinkActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const isMoreActive = secondaryLinks.some((link) => isLinkActive(link.href));

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Top Banner */}
      <div className="bg-maroon-500 text-gold-100 text-xs py-2 px-4 flex justify-between items-center z-50 relative font-medium">
        <div className="min-w-0 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <FiPhone className="w-3.5 h-3.5" /> {SITE_CONFIG.phone}
          </span>
          <span className="hidden md:inline truncate">| {SITE_CONFIG.tagline}</span>
        </div>
        <div className="hidden sm:flex gap-4">
          <a href={SITE_CONFIG.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
          <a href={SITE_CONFIG.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
          <a href={SITE_CONFIG.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream-100/90 backdrop-blur-md shadow-md py-3 border-b border-saffron-100'
            : 'bg-cream-50 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-14 items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="min-w-0 flex items-center gap-2 group" aria-label="Gaurakshak home">
              <div className="w-10 h-10 shrink-0 saffron-gold-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                ॐ
              </div>
              <div className="min-w-0 flex flex-col">
                <span className="truncate text-xl font-extrabold text-saffron-700 leading-none group-hover:text-saffron-600 transition-colors">
                  {SITE_CONFIG.name}
                </span>
                <span className="truncate text-[10px] text-maroon-500 font-semibold uppercase mt-0.5">
                  Spiritual Samiti
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 rounded-full bg-white/55 px-2 py-1.5 ring-1 ring-saffron-100">
              {primaryLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-saffron-50 text-saffron-700'
                        : 'text-stone-700 hover:text-saffron-500'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {secondaryLinks.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen((open) => !open)}
                    onBlur={() => window.setTimeout(() => setIsMoreOpen(false), 150)}
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                      isMoreActive
                        ? 'bg-saffron-50 text-saffron-700'
                        : 'text-stone-700 hover:text-saffron-500'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={isMoreOpen}
                  >
                    More
                    <FiChevronDown className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMoreOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 rounded-lg border border-saffron-100 bg-cream-100 p-2 shadow-xl">
                      {secondaryLinks.map((link) => {
                        const isActive = isLinkActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMoreOpen(false)}
                            className={`block rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                              isActive
                                ? 'bg-saffron-500 text-white'
                                : 'text-stone-700 hover:bg-saffron-50 hover:text-saffron-700'
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Header CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/booking"
                className="orange-gradient text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <FiCalendar className="h-4 w-4" /> Book Katha
              </Link>
              {showAuthenticatedUser ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className="flex max-w-36 items-center gap-1.5 truncate text-stone-700 hover:text-saffron-600 text-sm font-semibold transition-colors"
                  >
                    <FiUser className="h-4 w-4 shrink-0" />
                    <span className="truncate">{showAuthenticatedUser.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors"
                  >
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-stone-700 hover:text-saffron-600 text-sm font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-saffron-600 hover:bg-saffron-700 text-white px-4 py-2.5 rounded-full text-sm font-bold transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden rounded-full p-2 text-stone-700 hover:bg-saffron-50 hover:text-saffron-500 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 max-h-[calc(100vh-104px)] overflow-y-auto bg-cream-100 border-b border-saffron-100 shadow-xl animate-fadeIn">
            <div className="px-4 pt-3 pb-6 space-y-1 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      isActive
                        ? 'bg-saffron-500 text-white'
                        : 'text-stone-700 hover:bg-saffron-50 hover:text-saffron-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 px-4 space-y-2">
                {showAuthenticatedUser ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center block bg-saffron-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-saffron-700 transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full text-center block bg-red-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center block bg-saffron-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-saffron-700 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center block bg-orange-600 text-white px-5 py-3 rounded-full text-base font-bold hover:bg-orange-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
