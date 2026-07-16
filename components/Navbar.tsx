'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { services } from './servicesData';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/#projecten', label: 'Projecten' },
    { href: '/#over-ons', label: 'Over ons' },
    { href: '/#reviews', label: 'Reviews' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/95 shadow-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f59e0b] rounded-md flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div>
              <span className="text-[#1a3a6b] font-black text-xl tracking-tight">WIDOR</span>
              <p className="text-[#f59e0b] text-xs font-medium tracking-widest uppercase">Schildersbedrijf</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Diensten dropdown */}
            <div className="relative group">
              <a
                href="/#diensten"
                className="flex items-center gap-1 text-[#1a3a6b]/70 hover:text-[#f59e0b] font-medium text-sm transition-colors duration-200"
              >
                Diensten
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" className="mt-0.5 transition-transform duration-200 group-hover:rotate-180">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              {/* Panel — pt-3 bridges the gap so hover doesn't drop */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block group-focus-within:block z-50">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-60">
                  {services.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/diensten/${service.slug}`}
                      className="block px-4 py-2.5 text-sm font-medium text-[#1a3a6b]/80 hover:bg-[#1a3a6b]/5 hover:text-[#f59e0b] transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#1a3a6b]/70 hover:text-[#f59e0b] font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+310000000000" className="flex items-center gap-2 text-[#1a3a6b]/80 hover:text-[#1a3a6b] text-sm font-medium">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
              </svg>
              06-00 000 000
            </a>
            <a
              href="/#contact"
              className="bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold text-sm px-5 py-2.5 rounded-md transition-colors duration-200"
            >
              Gratis offerte
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[#1a3a6b] p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu openen"
          >
            {isOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4 mt-4">
              {/* Diensten met uitklapbare submenu */}
              <div>
                <button
                  onClick={() => setServicesOpen((o) => !o)}
                  className="w-full flex items-center justify-between text-[#1a3a6b]/70 hover:text-[#f59e0b] font-medium py-1"
                  aria-expanded={servicesOpen}
                >
                  Diensten
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div className="mt-2 ml-2 flex flex-col gap-2 border-l-2 border-gray-100 pl-4">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/diensten/${service.slug}`}
                        className="text-[#1a3a6b]/60 hover:text-[#f59e0b] text-sm py-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#1a3a6b]/70 hover:text-[#f59e0b] font-medium py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-5 py-3 rounded-md text-center mt-2"
                onClick={() => setIsOpen(false)}
              >
                Gratis offerte aanvragen
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
