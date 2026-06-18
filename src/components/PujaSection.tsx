import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PujaSection() {
  return (
    <section className="bg-amber-50 py-16 px-6">
      
      {/* Heading */}
      
<h1 className="text-4xl md:text-5xl font-bold text-orange-600 text-center mb-12">
  Let the{' '}
  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
    Divine
  </span>{' '}
  Come to You
</h1>

      {/* Image + Text Row */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-10 max-w-6xl mx-auto">

        {/* Image */}
        <div className="flex-1 relative">
          <img
            src="/images/Puja_Img.png"
            alt="Puja at Home"
            className="w-full h-[700px] object-cover rounded-2xl shadow-xl"
          />
        </div>

        {/* Text */}
        <div className="flex-1 flex flex-col justify-center text-justify">
          {/* <p className="text-lg pt-8 text-bold text-foreground/80 leading-relaxed [word-spacing:8px] text-justify text-center h-full ">
            At Namanpuja, we bring the sacred tradition of puja right to your doorstep.
            Our verified and experienced pandits perform authentic Vedic rituals at your home —
            from Satyanarayan Katha to Griha Pravesh — with full devotion and proper vidhi.
            No temple rush, no samagri hunting. Just book your puja, pick a date, and we handle everything.
            Serving devotees across multiple cities, we have helped over 10,000 families invite the
            divine into their homes — with faith, tradition, and love.
          </p> */}
          <p className="text-lg pt-2 text-foreground/80 leading-loose [word-spacing:4px] text-justify max-w-xl mx-auto">
  At <span className="text-orange-500 font-semibold">Namanpuja</span>, we bring the sacred 
  tradition of puja right to your doorstep. Our verified and experienced pandits perform 
  authentic Vedic rituals at your home — from{' '}
  <span className="text-orange-400 font-medium">Satyanarayan Katha</span> to{' '}
  <span className="text-orange-400 font-medium">Griha Pravesh</span> — with full devotion 
  and proper vidhi. No temple rush, no samagri hunting. Just book your puja, pick a date, 
  and we handle everything.
  <br /><br />
  Whether it's a small family prayer or a grand ceremonial puja, our pandits bring the 
  sanctity of the temple right into your living space — with all the samagri, mantras, and 
  blessings you deserve. We take care of every detail so you can focus entirely on your faith.
  <br /><br />
  Serving devotees across multiple cities, we have helped {' '}
  <span className="text-orange-500 font-semibold">Multiple families</span> invite the divine 
  into their homes — with{' '}
  <span className="italic text-orange-400">faith, tradition, and love.</span>
</p>
           <a
            href="/book"
            className="inline-flex mt-8 items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-7 rounded-full transition-all w-fit shadow-md text-base"
          >
            Connect with Sacred Services <ArrowRight className="h-4 w-4" />
          </a>
          
                     
        </div>

      </div>
    </section>
  );
}