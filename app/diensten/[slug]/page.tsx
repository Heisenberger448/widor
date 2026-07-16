import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { services, getService } from '@/components/servicesData';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: 'Dienst niet gevonden – VAK Schilderwerken' };
  return {
    title: `${service.title} – VAK Schilderwerken`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);
  const heroImage = service.image ?? '/hero-placeholder.svg';

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

          {/* Photo on the right — same brush-swept diagonal edge as the home hero */}
          <div
            className="hidden lg:block absolute inset-y-0 right-0 w-[55%] bg-cover bg-center"
            style={{
              backgroundImage: `url('${heroImage}')`,
              WebkitMaskImage: "url('/brush-mask.svg')",
              maskImage: "url('/brush-mask.svg')",
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          />

          {/* Gradient: dark on the left for text legibility, clears on the right so the photo shows */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0f2347] from-25% via-[#1a3a6b]/80 via-55% to-transparent to-80%" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/#diensten" className="hover:text-white transition-colors">Diensten</Link>
                <span>/</span>
                <span className="text-white/90">{service.title}</span>
              </nav>

              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
                {service.title}
              </h1>
              <p className="text-lg text-white/75 leading-relaxed">{service.intro}</p>
            </div>
          </div>

          {/* Bottom wave — same as the home hero */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
              <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-[#1a3a6b] mb-6">Wat wij voor u verzorgen</h2>
            <ul className="grid sm:grid-cols-2 gap-4 mb-12">
              {service.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="w-6 h-6 mt-0.5 shrink-0 bg-[#f59e0b]/15 rounded-full flex items-center justify-center">
                    <svg width="14" height="14" fill="none" stroke="#f59e0b" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-gray-600 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA card */}
            <div className="bg-[#1a3a6b] rounded-2xl p-8 sm:p-10 text-center">
              <h3 className="text-2xl font-black text-white mb-3">
                Interesse in {service.title.toLowerCase()}?
              </h3>
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
                <a
                  href="tel:+310000000000"
                  className="border-2 border-white/60 hover:border-white text-white font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:bg-white/10 flex items-center gap-2 text-sm"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z" />
                  </svg>
                  Bel direct
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other services */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-[#1a3a6b] mb-8 text-center">
              Onze andere diensten
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/diensten/${other.slug}`}
                  className="flex flex-col bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="w-14 h-14 bg-[#1a3a6b] rounded-xl flex items-center justify-center text-[#f59e0b] mb-5 group-hover:bg-[#f59e0b] group-hover:text-[#1a3a6b] transition-colors duration-300">
                    {other.icon}
                  </div>
                  <h3 className="font-bold text-[#1a3a6b] text-lg mb-2">{other.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{other.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
