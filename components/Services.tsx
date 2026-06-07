const services = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Binnenschilderwerk',
    description:
      'Muren, plafonds, kozijnen en deuren — wij zorgen voor een strakke en duurzame afwerking in uw woning of bedrijfspand.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Buitenschilderwerk',
    description:
      'Gevels, daklijsten, kozijnen en deuren buiten. Bescherm uw woning tegen de elementen met professioneel buitenschilderwerk.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Latex spuitwerk',
    description:
      'Airless latex spuiten voor een streeploze en egale afwerking van wanden en plafonds. Snel, efficiënt en van hoge kwaliteit.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Renovlies behangen',
    description:
      'Renovlies zorgt voor strak gestucte muren zonder scheuren, snelle oplevering en een duurzaam eindresultaat dat direct geschilderd kan worden.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Onderhoudsschilderwerk',
    description:
      'Periodiek onderhoud verlengt de levensduur van uw schilderwerk aanzienlijk. Wij stellen een onderhoudsplan op maat op.',
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Bedrijfspanden',
    description:
      'Van kantoor tot winkel — WIDOR verzorgt ook commercieel schilderwerk snel en netjes, met minimale overlast voor uw bedrijfsvoering.',
  },
];

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
            Van binnen tot buiten, van woonhuis tot bedrijfspand. WIDOR heeft de expertise en
            het materiaal voor elk project in Zuid-Holland.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 bg-[#1a3a6b]/10 rounded-xl flex items-center justify-center text-[#1a3a6b] mb-5 group-hover:bg-[#1a3a6b] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="font-bold text-[#1a3a6b] text-lg mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
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
