// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import FrontPuja from '../../public/images/CenterPageImages/FrontPuja.png';
// import FrontLocation from '../../public/images/CenterPageImages/FrontLocation.png';
// import FrontForm from '../../public/images/CenterPageImages/FrontForm.png';

// const slides = [
//    {
//     image: FrontPuja,
//     alt: 'Form',
//     tagline: 'Bringing Peace, Prosperity, and Divine Blessings to Every Home.',
//     heading: 'Experience Authentic Vedic Rituals with Trusted Pandits',
//     cta: 'Get Started with Us',
//     path: '/pujas/MainPuja',
//   },
// {
//     image: FrontForm,
//     alt: 'Puja',
//     tagline: 'Traditional ceremonies conducted by experienced pandits.',
//     heading: 'Embrace  Blessings Through Timeless Vedic Ceremonies',
//     cta: 'Schedule Your Blessing',
//     path: '/book',
//   },
//   {
//     image: FrontLocation,
//     alt: 'Location',
//     tagline: 'Trusted pandits, sacred rituals, and divine blessings—wherever you call home.',
//     heading: 'Sacred Vedic Rituals for Families Across the Globe',
//     cta: 'Explore Divine Destinations',
//     path: '/MainLocation',
    
//   },
// ];

// export function SlideImg() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [textVisible, setTextVisible] = useState(true);
//   const [renderedSlides, setRenderedSlides] = useState<Set<number>>(new Set([0]));

//   useEffect(() => {
//     setRenderedSlides((prev) => {
//       const next = new Set(prev);
//       next.add(currentSlide);
//       next.add((currentSlide + 1) % slides.length);
//       return next;
//     });
//   }, [currentSlide]);

//   useEffect(() => {
//     const interval = setInterval(() => handleNext(), 8000);
//     return () => clearInterval(interval);
//   }, [currentSlide]);

//   const changeSlide = (index: number) => {
//     setTextVisible(false);
//     setTimeout(() => {
//       setCurrentSlide(index);
//       setTextVisible(true);
//     }, 500);
//   };

//   const handlePrev = () =>
//     changeSlide((currentSlide - 1 + slides.length) % slides.length);

//   const handleNext = () =>
//     changeSlide((currentSlide + 1) % slides.length);

//   const slide = slides[currentSlide];

//   return (
//     <div className="relative w-full h-[620px] overflow-hidden rounded-l">

//       {/* Slides */}
//       {slides.map((s, index) => {
//         if (!renderedSlides.has(index)) return null;
//         return (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               index === currentSlide ? 'opacity-100' : 'opacity-0'
//             }`}
//           >
//             <Image
//               src={s.image}
//               alt={s.alt}
//               fill
//               className="object-cover"
//               priority={index === 0}
//             //   style={{ objectPosition: s.objectPosition ?? 'center' }}
//             />
//             {/* Dark overlay so text is readable */}
//             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
//           </div>
//         );
//       })}

//       {/* Text + Button — on top of image */}
//       <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pt-20">
//         {/* Tagline */}
//         <p
//           className={`text-sm md:text-lg text-white/80 mb-2 transition-all duration-500 ${
//             textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//           }`}
//         >
//           {slide.tagline}
//         </p>

//         {/* Heading */}
//         <h1
//           className={`text-3xl md:text-5xl font-bold text-white mb-6 transition-all duration-500 delay-100 ${
//             textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//           }`}
//         >
//           {slide.heading}
//         </h1>

//         {/* CTA Button */}
//         <a
//           href={slide.path}
//           className={`rounded-xl mt-10 bg-saffron-500 px-8 py-3 font-bold text-white shadow-xl transition-all duration-500 delay-200 hover:bg-saffron-600 hover:scale-105 ${
//             textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
//           }`}
//         >
//           {slide.cta}
//         </a>
//       </div>

//       {/* Prev Button */}
//       <button
//         onClick={handlePrev}
//         className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition"
//         aria-label="Previous"
//       >
//         <ChevronLeft className="w-6 h-6" />
//       </button>

//       {/* Next Button */}
//       <button
//         onClick={handleNext}
//         className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition"
//         aria-label="Next"
//       >
//         <ChevronRight className="w-6 h-6" />
//       </button>

//       {/* Dots */}
//       {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 ">
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => changeSlide(i)}
//             className={`h-2 rounded-full transition-all ${
//               i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'
//             }`}
//           />
//         ))}
//       </div> */}

//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FrontPuja from '../../public/images/CenterPageImages/FrontPuja.png';
import FrontLocation from '../../public/images/CenterPageImages/FrontLocation.png';
import FrontForm from '../../public/images/CenterPageImages/FrontForm.png';

const slides = [
  { image: FrontPuja, alt: 'Puja' },
  { image: FrontForm, alt: 'Form' },
  { image: FrontLocation, alt: 'Location' },
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
            <Image
              src={s.image}
              alt={s.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        );
      })}
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/65" />
    </div>
  );
}