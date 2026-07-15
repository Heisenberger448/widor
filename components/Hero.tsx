import HeroWizard from './HeroWizard';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#1a3a6b] flex items-center overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Photo on the right — brush-swept diagonal edge into the blue */}
      <div
        className="hidden lg:block absolute inset-y-0 right-0 w-[62%] bg-cover bg-center"
        style={{
          backgroundImage: "url('/home-hero.jpg')",
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-28 md:py-36">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">

          {/* Left — hero text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#f59e0b]/20 border border-[#f59e0b]/40 text-[#f59e0b] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse" />
              Actief in Zuid-Holland
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Professioneel
              <span className="block text-[#f59e0b]">schilderwerk</span>
              van vakmannen
            </h1>

            <p className="text-base text-white/75 leading-relaxed mb-7 max-w-lg">
              WIDOR Schildersbedrijf verzorgt kwalitatief schilderwerk binnen en buiten in heel
              Zuid-Holland. Van kozijnen en gevels tot volledige interieurs — wij leveren
              strak en duurzaam werk.
            </p>

            {/* USPs */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8">
              {[
                'Gratis offerte op locatie',
                '20+ jaar ervaring',
                'Binnen 2 dagen reactie',
              ].map((usp) => (
                <div key={usp} className="flex items-center gap-2 text-white/90 text-sm">
                  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#f59e0b" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {usp}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-lg text-sm"
              >
                Gratis offerte aanvragen
              </a>
              <a
                href="tel:+310000000000"
                className="border-2 border-white/60 hover:border-white text-white font-bold px-6 py-3.5 rounded-md transition-all duration-200 hover:bg-white/10 flex items-center gap-2 text-sm"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
                </svg>
                Bel direct
              </a>
            </div>
          </div>

          {/* Right — price wizard */}
          <div className="flex justify-center lg:justify-end">
            <HeroWizard />
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="#f9fafb"/>
        </svg>
      </div>
    </section>
  );
}
