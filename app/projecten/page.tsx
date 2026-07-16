import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { projects } from '@/components/projectsData';

export const metadata: Metadata = {
  title: 'Projecten – VAK Schilderwerken',
  description:
    'Bekijk uitgevoerde schilderprojecten van VAK Schilderwerken in Zuid-Holland. Voor & na — zie het verschil zelf.',
};

export default function ProjectenPage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col">
        {/* Header */}
        <section className="relative bg-[#1a3a6b] pt-40 pb-36 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/90">Projecten</span>
            </nav>
            <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Ons werk</p>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Onze projecten
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-2xl">
              Een greep uit uitgevoerde schilderprojecten in heel Zuid-Holland. Sleep de schuifknop
              om het verschil te zien tussen vóór en na ons werk.
            </p>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
              <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* Projects grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#1a3a6b] rounded-2xl p-8 sm:p-10 text-center">
              <h2 className="text-2xl font-black text-white mb-3">Ook uw project laten uitvoeren?</h2>
              <p className="text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
                Vraag vrijblijvend een offerte aan. Wij komen graag bij u langs voor advies op
                locatie en een scherpe prijs.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-lg text-sm"
              >
                Gratis offerte aanvragen
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
