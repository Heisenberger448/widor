'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface BeforeAfterSliderProps {
  title: string;
  description?: string;
  /** When set, an orange "Bekijk project" link is shown that navigates to this project page */
  href?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeBg?: string;
  afterBg?: string;
  beforeImage?: string;
  afterImage?: string;
  /** Extra classes on the "after" image — e.g. a subtle scale so near-identical before/after photos don't line up perfectly */
  afterImageClassName?: string;
  initialPosition?: number;
}

export default function BeforeAfterSlider({
  title,
  description,
  href,
  beforeLabel = 'Voor',
  afterLabel = 'Na',
  beforeBg = 'bg-gray-300',
  afterBg = 'bg-blue-200',
  beforeImage,
  afterImage,
  afterImageClassName = '',
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track the slider width so the clipped "before" image stays aligned with the "after" image
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => setContainerWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const pct = (x / rect.width) * 100;
    setPosition(Math.min(Math.max(pct, 2), 98));
    setHasInteracted(true);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  }, [updatePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updatePosition(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) updatePosition(e.touches[0].clientX);
    };
    const handleUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* Slider area */}
      <div
        ref={containerRef}
        className="relative h-72 sm:h-80 md:h-96 cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* After image (full width, background) */}
        <div className="absolute inset-0">
          {afterImage ? (
            <img
              src={afterImage}
              alt={`${title} — na`}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${afterImageClassName}`}
            />
          ) : (
            <div className={`absolute inset-0 ${afterBg} flex items-center justify-center`}>
              <div className="text-center pointer-events-none">
                <svg width="48" height="48" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-2">
                  <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
                </svg>
                <p className="text-white/70 text-sm font-medium">Na foto</p>
              </div>
            </div>
          )}
          {/* After label bottom */}
          <div className="absolute bottom-4 right-4 bg-[#1a3a6b] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            {afterLabel}
          </div>
        </div>

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          {beforeImage ? (
            <img
              src={beforeImage}
              alt={`${title} — voor`}
              className="absolute inset-0 h-full max-w-none object-cover pointer-events-none"
              style={{ width: containerWidth ? `${containerWidth}px` : '100%' }}
            />
          ) : (
            <div className={`absolute inset-0 ${beforeBg} flex items-center justify-center`}>
              <div className="text-center pointer-events-none" style={{ width: '100vw', maxWidth: '100%' }}>
                <svg width="48" height="48" fill="none" stroke="rgba(100,100,100,0.5)" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-2">
                  <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
                </svg>
                <p className="text-gray-500 text-sm font-medium">Voor foto</p>
              </div>
            </div>
          )}
          {/* Before label bottom */}
          <div className="absolute bottom-4 left-4 bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            {beforeLabel}
          </div>
        </div>

        {/* Slider handle line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          {/* Drag button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <svg width="10" height="16" fill="#1a3a6b" viewBox="0 0 10 16">
                <path d="M2 0L0 4h4L2 0zm0 16l2-4H0l2 4zm4-16l2 4h-4l2-4zm0 16l-2-4h4l-2 4z" fillOpacity="0.8"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Drag hint */}
        {!hasInteracted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
              </svg>
              Sleep om te vergelijken
            </div>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-[#1a3a6b] text-lg">{title}</h3>
        {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
        {href && (
          <Link
            href={href}
            className="mt-auto pt-4 self-start inline-flex items-center gap-1.5 text-[#f59e0b] font-bold text-sm hover:gap-2.5 transition-all"
          >
            Bekijk project
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
