
'use client';

import { useState, useEffect } from 'react';

const slides = [
  { image: '/images/CenterPageImages/FrontPuja.png', alt: 'Puja' },
  { image: '/images/CenterPageImages/FrontForm.png', alt: 'Form' },
  { image: '/images/CenterPageImages/FrontLocation.png', alt: 'Location' },
];

export function SlideImg() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [renderedSlides, setRenderedSlides] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    setRenderedSlides((prev) => {
      const next = new Set(prev);
      next.add(currentSlide);
      next.add((currentSlide + 1) % slides.length);
      return next;
    });
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 -z-10  ">
      {slides.map((s, index) => {
        if (!renderedSlides.has(index)) return null;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.alt}
              // fill
              className="object-cover w-full h-full"
              // priority={index === 0}
            />
          </div>
        );
      })}
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/65" />
    </div>
  );
}