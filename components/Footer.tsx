import Link from 'next/link';
import { services } from './servicesData';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f2347] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f59e0b] rounded-md flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <p className="font-black text-lg">VAK</p>
                <p className="text-[#f59e0b] text-xs tracking-widest uppercase">Schilderwerken</p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Professioneel schildersbedrijf actief in heel Zuid-Holland. Vakmannen met meer dan
              20 jaar ervaring.
            </p>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#f59e0b]">Diensten</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/diensten/${service.slug}`}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Werkgebied */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#f59e0b]">Werkgebied</h4>
            <ul className="space-y-2">
              {[
                'Rotterdam',
                'Den Haag',
                'Delft',
                'Zoetermeer',
                'Leiden',
                'Heel Zuid-Holland',
              ].map((item) => (
                <li key={item}>
                  <span className="text-white/60 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#f59e0b]">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+310000000000" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.36h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/>
                  </svg>
                  06-00 000 000
                </a>
              </li>
              <li>
                <a href="mailto:info@widor.nl" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  info@widor.nl
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round"/>
                </svg>
                Ma–Za 07:00–17:00
              </li>
            </ul>

            {/* WhatsApp */}
            <a
              href="https://wa.me/310000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.118 1.531 5.845L.044 23.956 6.28 22.47A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.87 0-3.617-.487-5.132-1.341l-.368-.217-3.815.998 1.018-3.72-.238-.38A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {currentYear} VAK Schilderwerken. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacybeleid</a>
            <a href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">Algemene voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
