import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import UpcomingKathas from '@/components/home/UpcomingKathas';
import SamitiIntro from '@/components/home/SamitiIntro';
import KathaServices from '@/components/home/KathaServices';
import GalleryPreview from '@/components/home/GalleryPreview';
import Testimonials from '@/components/home/Testimonials';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <UpcomingKathas />
      <SamitiIntro />
      <KathaServices />
      <GalleryPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
