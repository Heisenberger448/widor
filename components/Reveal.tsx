'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Onthult zijn inhoud met een fade + omhoog-beweging zodra het element in beeld
 * scrolt. Geef een `index` mee voor een gestaffeld "één voor één"-effect.
 */
export default function Reveal({
  children,
  index = 0,
  className = '',
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[600ms] ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-40'
      } ${className}`}
      style={{
        transitionDelay: visible ? `${index * 90}ms` : '0ms',
        // slight overshoot so the cards really "fly in" and settle
        transitionTimingFunction: 'cubic-bezier(0.22, 1.4, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}
