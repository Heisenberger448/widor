'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    naam: '',
    telefoon: '',
    email: '',
    postcode: '',
    dienst: '',
    bericht: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement form submission (e.g. emailjs, api route, etc.)
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-[#1a3a6b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: info */}
          <div className="text-white">
            <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-6">
              Vraag een gratis<br />offerte aan
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              Vul het formulier in en wij nemen binnen 1 werkdag contact met u op voor een
              vrijblijvende offerte op locatie.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
                    </svg>
                  ),
                  label: 'Telefoon',
                  value: '06-00 000 000',
                  href: 'tel:+310000000000',
                },
                {
                  icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  ),
                  label: 'E-mail',
                  value: 'info@widor.nl',
                  href: 'mailto:info@widor.nl',
                },
                {
                  icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: 'Werkgebied',
                  value: 'Heel Zuid-Holland',
                  href: null,
                },
                {
                  icon: (
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14" strokeLinecap="round"/>
                    </svg>
                  ),
                  label: 'Openingstijden',
                  value: 'Ma–Za 07:00–17:00',
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-[#f59e0b] flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white font-semibold hover:text-[#f59e0b] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-semibold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1a3a6b] mb-2">Aanvraag ontvangen!</h3>
                <p className="text-gray-500">Wij nemen binnen 1 werkdag contact met u op.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#1a3a6b] mb-1">Gratis offerte aanvragen</h3>
                  <p className="text-gray-400 text-sm">Reactie binnen 1 werkdag · Geheel vrijblijvend</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Naam *</label>
                    <input
                      type="text"
                      required
                      value={formData.naam}
                      onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]"
                      placeholder="Uw naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Telefoon *</label>
                    <input
                      type="tel"
                      required
                      value={formData.telefoon}
                      onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]"
                      placeholder="06-00 000 000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mailadres</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]"
                      placeholder="uw@email.nl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Postcode *</label>
                    <input
                      type="text"
                      required
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]"
                      placeholder="1234 AB"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Soort werk</label>
                  <select
                    value={formData.dienst}
                    onChange={(e) => setFormData({ ...formData, dienst: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] bg-white"
                  >
                    <option value="">Selecteer een dienst</option>
                    <option value="binnenschilderwerk">Binnenschilderwerk</option>
                    <option value="buitenschilderwerk">Buitenschilderwerk</option>
                    <option value="latex-spuitwerk">Latex spuitwerk</option>
                    <option value="renovlies">Renovlies behangen</option>
                    <option value="onderhoud">Onderhoudsschilderwerk</option>
                    <option value="bedrijfspand">Bedrijfspand</option>
                    <option value="anders">Anders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bericht</label>
                  <textarea
                    rows={3}
                    value={formData.bericht}
                    onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b] resize-none"
                    placeholder="Omschrijf kort uw project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-md text-sm"
                >
                  Gratis offerte aanvragen →
                </button>
                <p className="text-gray-400 text-xs text-center">Wij gaan zorgvuldig met uw gegevens om.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
