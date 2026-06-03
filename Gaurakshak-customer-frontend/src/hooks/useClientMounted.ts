'use client';

import { useEffect, useState } from 'react';

export const useClientMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return isMounted;
};
