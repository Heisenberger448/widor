import Link from 'next/link';
import { services } from './servicesData';
import Reveal from './Reveal';

export default function Services() {
  return (
    <section id="diensten" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Onze diensten</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b] leading-tight">
            Alles voor het perfecte schilderwerk
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Van binnen tot buiten, van woonhuis tot bedrijfspand. VAK heeft de expertise en
            het materiaal voor elk project in Zuid-Holland.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <Reveal key={service.slug} index={i} className="h-full">
            <Link
              href={`/diensten/${service.slug}`}
              className="flex flex-col h-full bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 bg-[#1a3a6b] rounded-xl flex items-center justify-center text-[#f59e0b] mb-5 group-hover:bg-[#f59e0b] group-hover:text-[#1a3a6b] transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-bold text-[#1a3a6b] text-lg mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[#f59e0b] font-semibold text-sm group-hover:gap-2.5 transition-all">
                Meer over deze dienst
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-block bg-[#1a3a6b] hover:bg-[#0f2347] text-white font-bold px-8 py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-md"
          >
            Vraag een vrijblijvende offerte aan
          </a>
        </div>
      </div>
    </section>
  );
}
