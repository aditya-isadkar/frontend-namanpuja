import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Linkedin
} from "lucide-react";
import namanLogo from "@/assets/naman.webp";
// import { openWhatsApp } from "@/services/native";

const Footer = () => {
  const navigate = useNavigate();
  const quickLinks = [
    { name: "Satyanarayan Puja", href: "/pujas/satyanarayan-puja" },
    { name: "Griha Pravesh Puja", href: "/pujas/griha-pravesh-puja" },
    { name: "Ganesh Puja", href: "/pujas/ganesh-puja" },
    { name: "Lakshmi Puja", href: "/pujas/lakshmi-puja" },
    { name: "Navagraha Shanti Puja", href: "/pujas/navagraha-shanti-puja" },
    
  ];

  const services: { name: string; href?: string }[] = [
    { name: "NamanDarshan", href: "https://namandarshan.com/" },
    { name: "Puja Services", href: "/pujas/MainPuja" },
    { name: "NamanKart", href: "https://www.namankart.com/" },
    { name: "Prasadam Seva", href: "https://namandarshan.com/prasadam" },
    { name: "Astro Services", href: "https://namandarshan.com/astro-naman" },
  ];

  const support = [
    { name: "About Us", href: "#" },
    // { name: "News & Events", href: "/news-events" },
    // { name: "Blogs", href: "/blogs" },
    // { name: "Gallery", href: "/gallery" },
    // {name:"Media", href:"/media/aarti"},
    // { name: "Volunteer", href: "/volunteer" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Disclaimer", href: "#" },
  ];
  const ContactUs = [
  { name: "Call Sales", href: "tel:+919876543210" },
  { name: "Email Sales", href: "mailto:sales@namanpuja.com" },
  { name: "Call Support", href: "tel:+919876543210" },
  { name: "Email Support", href: "mailto:support@namanpuja.com" },
];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Brand Column */}
          <div className="space-y-6 ml-8">
            <a href="/" className="flex flex-col items-start leading-none">
              {/* <img src={namanLogo} alt="Naman" className="h-20 w-auto object-contain" /> */}
              <img src="/images/Namanpuja_Logo.png" alt="Namanpuja Logo" className="h-28 w-auto pl-8 object-contain"/>
              <span className="text-[15px] font-bold text-primary uppercase tracking-[0.05em] mt-1 whitespace-nowrap opacity-80">
                Seva • Suvidha • Samarpan
              </span>
            </a>
            <p className="text-white/70 leading-relaxed">
              Experience divine ease with Guided Darshan Assistance from Naman Darshan. A knowledgeable Pandit Ji will accompany you, guide you through the temple, and share insights about the temple's history and significance, prioritizing tranquility and reverence.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/people/Naman-Darshan/61562897897801/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/namandarshanofficial/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@Naman.Darshan?themeRefresh=1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/naman-darshan/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Contact Info / Company Links */}
          <div className="lg:pl-12">
            <h4 className="font-display text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-12">
            <h4 className="font-display text-xl font-semibold mb-6">Popular Pujas</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
       

          {/* Services */}
          <div className="lg:pl-12">
            <h4 className="font-display text-xl font-semibold mb-6">Our Other Services</h4>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.name}>
                  {link.name === "International Temple" ? (
                    <button
                      onClick={() => {
                          navigate('/darshan?category=international#available-darshans');                      }}
                      className="text-white/70 hover:text-primary transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  ) : link.href?.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href!}
                      className="text-white/70 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Sales and Support */}
<div className="lg:pl-12">
  <h4 className="font-display text-xl font-semibold mb-6">Sales and Support</h4>

  <div className="mb-5">
    <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Sales Team</p>
    <ul className="space-y-3">
      {ContactUs.slice(0, 2).map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            className="text-white/70 hover:text-primary transition-colors"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>

  <div>
    <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Customer Service</p>
    <ul className="space-y-3">
      {ContactUs.slice(2, 4).map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            className="text-white/70 hover:text-primary transition-colors"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
</div>


        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center">
              Copyright 2026 by NAMANDARSHAN (Namandarshan is an alliance of Traininglobe Consultancy Private Limited)
            </p>
            <p className="text-white/50 text-xs text-center max-w-xl">
              Guided Darshan Assistance is designed to provide dedicated guide and accompaniment services from local Pandit Jis for temple visits.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
