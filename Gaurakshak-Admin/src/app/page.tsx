'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-[#F8F9FB]">
      <div className="text-stone-500 font-bold animate-pulse text-sm">
        Redirecting...
      </div>
    </div>
  );
}
