const stats = [
  { value: '20+', label: 'Jaar ervaring' },
  { value: '500+', label: 'Tevreden klanten' },
  { value: '1000+', label: 'Projecten voltooid' },
  { value: '100%', label: 'Vakmanschap' },
];

const usps = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 0 2-2h11" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Gratis offerte op locatie',
    text: 'Wij komen vrijblijvend langs om alles op te meten en een offerte op maat te maken.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Stipt op tijd',
    text: 'Afspraken zijn afspraken. Wij houden ons aan de planning en leveren op tijd op.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Kwaliteitsgarantie',
    text: 'Wij werken uitsluitend met A-merkverf en materialen. Uw tevredenheid is onze garantie.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Eigen vakmannen',
    text: 'Geen onderaannemers. Al ons werk wordt uitgevoerd door onze eigen, gecertificeerde schilders.',
  },
];

export default function About() {
  return (
    <section id="over-ons" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        <div className="bg-[#1a3a6b] rounded-2xl p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-[#f59e0b]">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Over VAK</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b] leading-tight mb-6">
              Vakmannen met passie voor het vak
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              VAK Schilderwerken is actief in heel Zuid-Holland. Met meer dan 20 jaar ervaring in
              zowel woning- als bedrijfsschilderwerk leveren wij kwaliteit die zichtbaar blijft.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Wij geloven in eerlijk werk voor een eerlijke prijs. Geen verrassingen achteraf,
              geen onderaannemers — gewoon betrouwbare schilders die trots zijn op hun werk.
            </p>
            <a
              href="#contact"
              className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-7 py-4 rounded-md transition-all duration-200 hover:-translate-y-0.5 shadow-md"
            >
              Maak een afspraak
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usps.map((usp) => (
              <div key={usp.title} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="text-[#1a3a6b] mb-3">{usp.icon}</div>
                <h3 className="font-bold text-[#1a3a6b] mb-1 text-sm">{usp.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{usp.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
