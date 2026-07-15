import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { projects, getProject } from '@/components/projectsData';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project niet gevonden – WIDOR Schildersbedrijf' };
  return {
    title: `${project.title} – WIDOR Schildersbedrijf`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug);

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
              <Link href="/projecten" className="hover:text-white transition-colors">Projecten</Link>
              <span>/</span>
              <span className="text-white/90">{project.title}</span>
            </nav>
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] text-sm font-semibold px-3 py-1 rounded-full mb-5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {project.location}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
                {project.title}
              </h1>
              <p className="text-lg text-white/75 leading-relaxed">{project.intro}</p>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
              <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* Before/after + details */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <BeforeAfterSlider
                title={project.title}
                beforeBg={project.beforeBg}
                afterBg={project.afterBg}
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                afterImageClassName={project.afterImageClassName}
                initialPosition={project.initialPosition}
              />
              <p className="text-center text-gray-400 text-sm mt-3">Sleep de schuifknop om vóór en na te vergelijken</p>
            </div>

            <div className="mt-12 max-w-3xl mx-auto">
              <h2 className="text-2xl font-black text-[#1a3a6b] mb-6">Uitgevoerde werkzaamheden</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {project.details.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-6 h-6 mt-0.5 shrink-0 bg-[#f59e0b]/15 rounded-full flex items-center justify-center">
                      <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="3" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div className="mt-12 max-w-3xl mx-auto bg-[#1a3a6b] rounded-2xl p-8 sm:p-10 text-center">
              <h3 className="text-2xl font-black text-white mb-3">Ook zo&apos;n resultaat?</h3>
              <p className="text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
                Vraag vrijblijvend een offerte aan. Wij komen graag bij u langs voor advies op
                locatie en een scherpe prijs.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/#contact"
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-lg text-sm"
                >
                  Gratis offerte aanvragen
                </Link>
                <Link
                  href="/projecten"
                  className="border-2 border-white/60 hover:border-white text-white font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:bg-white/10 text-sm"
                >
                  Alle projecten
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Other projects */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-[#1a3a6b] mb-8 text-center">Andere projecten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {others.map((other) => (
                <BeforeAfterSlider
                  key={other.slug}
                  title={other.title}
                  description={other.description}
                  href={`/projecten/${other.slug}`}
                  beforeBg={other.beforeBg}
                  afterBg={other.afterBg}
                  beforeImage={other.beforeImage}
                  afterImage={other.afterImage}
                  afterImageClassName={other.afterImageClassName}
                  initialPosition={other.initialPosition}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
