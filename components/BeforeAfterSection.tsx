import Link from 'next/link';
import BeforeAfterSlider from './BeforeAfterSlider';
import { projects } from './projectsData';

export default function BeforeAfterSection() {
  return (
    <section id="projecten" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Projecten</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b] leading-tight">
            Voor & na — zie het verschil zelf
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Sleep de schuifknop om het verschil te zien tussen vóór en na ons schilderwerk.
            Van verweerde kozijnen en gevels tot een strak, duurzaam eindresultaat — ontdek
            wat vakwerk voor uw pand betekent.
          </p>
        </div>

        {/* Sliders grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <BeforeAfterSlider
              key={project.slug}
              title={project.title}
              description={project.description}
              href={`/projecten/${project.slug}`}
              beforeBg={project.beforeBg}
              afterBg={project.afterBg}
              beforeImage={project.beforeImage}
              afterImage={project.afterImage}
              afterImageClassName={project.afterImageClassName}
              initialPosition={project.initialPosition}
            />
          ))}
        </div>

        {/* View all projects */}
        <div className="text-center mt-12">
          <Link
            href="/projecten"
            className="inline-flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-bold px-8 py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-md"
          >
            Bekijk al onze projecten
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
