import type { ReactNode } from 'react';

/**
 * MERKLOGO'S
 * ----------
 * Echte logo's staan in /public/Merken en worden als <img> geladen.
 * Voeg een merk toe door een logo in die map te zetten en hier een regel toe te voegen:
 *
 *   { naam: 'Flexa', mark: <img src="/merken/flexa.svg" alt="Flexa" className={LOGO_IMG} /> }
 *
 * De slider dupliceert de lijst automatisch voor een naadloze, oneindige loop
 * en beweegt continu (geen pauze).
 */

// Basis-styling voor elk logo. De hoogte staat per merk apart, zodat brede
// wordmarks en vierkante beeldmerken optisch even groot ogen.
const LOGO_BASE =
  'w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300';

interface Brand {
  naam: string;
  mark: ReactNode;
}

const brands: Brand[] = [
  { naam: 'Sikkens', mark: <img src="/merken/sikkens.svg" alt="Sikkens" className={`${LOGO_BASE} h-9`} /> },
  { naam: 'Sigma Coatings', mark: <img src="/merken/sigma-coatings.png" alt="Sigma Coatings" className={`${LOGO_BASE} h-9`} /> },
  { naam: 'Intervos', mark: <img src="/merken/Intervos-logo.svg" alt="Intervos" className={`${LOGO_BASE} h-7`} /> },
  { naam: 'Festool', mark: <img src="/merken/festool-gmbh-logo.svg" alt="Festool" className={`${LOGO_BASE} h-8`} /> },
  { naam: 'Graco', mark: <img src="/merken/graco-logo.png" alt="Graco" className={`${LOGO_BASE} h-8`} /> },
];

function LogoItem({ brand }: { brand: Brand }) {
  return <li className="flex items-center shrink-0">{brand.mark}</li>;
}

export default function BrandSlider() {
  return (
    <section className="py-14 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm">
          Vakwerk met topmaterialen
        </p>
      </div>

      {/* Auto-scrolling marquee — the list is rendered three times for a seamless,
          always-filled, continuous loop (animation shifts by exactly one copy) */}
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[0, 1, 2].map((copy) => (
            <ul key={copy} className="flex items-center gap-16 pr-16 shrink-0" aria-hidden={copy > 0}>
              {brands.map((brand) => (
                <LogoItem key={`${copy}-${brand.naam}`} brand={brand} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
