import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  spiritual?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  spiritual = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'}`}>
      {spiritual && (
        <span className="text-saffron-500 spiritual-text text-lg md:text-xl mb-2 block font-semibold animate-pulse">
          Blessings of Lord Krishna
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight relative pb-4">
        {title}
        <span className={`absolute bottom-0 left-0 w-20 h-1 bg-saffron-500 rounded-full ${centered ? 'left-1/2 -translate-x-1/2' : ''}`} />
      </h2>
      {subtitle && (
        <p className="mt-4 text-stone-600 max-w-2xl text-base md:text-lg leading-relaxed font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}
