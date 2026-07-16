const reviews = [
  {
    name: 'Jan de Vries',
    location: 'Rotterdam',
    rating: 5,
    text: 'Prima vakwerk geleverd en uitstekende service. Alles is stipt op tijd afgerond en het resultaat is fantastisch. Onze kozijnen zien er weer als nieuw uit!',
    date: 'Mei 2026',
  },
  {
    name: 'Marianne Bakker',
    location: 'Den Haag',
    rating: 5,
    text: 'Heel tevreden met het binnenschilderwerk. Netjes, snel en een strakke afwerking. De schilders waren vriendelijk en respecteerden ons huis.',
    date: 'April 2026',
  },
  {
    name: 'Peter van Dam',
    location: 'Delft',
    rating: 5,
    text: 'VAK heeft onze complete gevel geschilderd. Goede kwaliteit, mooie prijs en nakomen van afspraken. Echt aanrader voor iedereen in de regio.',
    date: 'Maart 2026',
  },
  {
    name: 'Sandra Hoekstra',
    location: 'Zoetermeer',
    rating: 5,
    text: 'Betrouwbaar, netjes op tijd en alles ziet er weer strak uit! Het latex spuitwerk is perfect egaal geworden. Voortaan altijd VAK.',
    date: 'Februari 2026',
  },
  {
    name: 'Tom Willems',
    location: 'Leiden',
    rating: 5,
    text: 'Wij hebben zowel binnens- als buitenschilderwerk laten uitvoeren. Beide keren topresultaat. Heldere communicatie en eerlijke offerte.',
    date: 'Januari 2026',
  },
  {
    name: 'Annelies Smit',
    location: 'Voorburg',
    rating: 5,
    text: 'Het renovlies behangen heeft onze muren compleet getransformeerd. Scheuren verdwenen, muren strak als stuc. Super tevreden!',
    date: 'December 2025',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < count ? '#f59e0b' : '#e5e7eb'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Klantbeoordelingen</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b] leading-tight">
            Wat onze klanten zeggen
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <span className="text-gray-600 font-semibold text-lg">5.0 / 5</span>
            <span className="text-gray-400 text-sm">· 50+ beoordelingen</span>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Google icon + rating */}
              <div className="flex items-center justify-between mb-4">
                <StarRating count={review.rating} />
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1a3a6b] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1a3a6b] text-sm">{review.name}</p>
                  <p className="text-gray-400 text-xs">{review.location} · {review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#1a3a6b] font-semibold hover:text-[#f59e0b] transition-colors text-sm"
          >
            Bekijk alle beoordelingen op Google
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
