import BeforeAfterSlider from './BeforeAfterSlider';

const projects = [
  {
    title: 'Buitenkozijnen woning Delft',
    description: 'Volledig herschilderwerk van kozijnen, dakgoot en voordeur. Resultaat: als nieuw.',
    beforeBg: 'bg-amber-200',
    afterBg: 'bg-sky-200',
    initialPosition: 50,
  },
  {
    title: 'Interieur renovatie Rotterdam',
    description: 'Airless latex spuitwerk woonkamer en hal. Streeploze afwerking in één dag.',
    beforeBg: 'bg-stone-300',
    afterBg: 'bg-slate-200',
    initialPosition: 40,
  },
  {
    title: 'Gevel appartementencomplex',
    description: 'Buitenschilderwerk van een volledig appartementencomplex in Den Haag.',
    beforeBg: 'bg-orange-200',
    afterBg: 'bg-blue-100',
    initialPosition: 55,
  },
];

export default function BeforeAfterSection() {
  return (
    <section id="projecten" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#f59e0b] font-bold uppercase tracking-widest text-sm mb-3">Projecten</p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6b] leading-tight">
            Voor & na — zie het verschil zelf
          </h2>
          <p className="mt-4 text-gray-500 text-lg leading-relaxed">
            Sleep de schuifknop om het verschil te zien tussen vóór en na ons schilderwerk.
            Placeholders worden vervangen door echte foto&apos;s van uw projecten.
          </p>
        </div>

        {/* Sliders grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <BeforeAfterSlider
              key={project.title}
              title={project.title}
              description={project.description}
              beforeBg={project.beforeBg}
              afterBg={project.afterBg}
              initialPosition={project.initialPosition}
            />
          ))}
        </div>

        {/* Info banner */}
        <div className="mt-12 bg-[#1a3a6b]/5 border border-[#1a3a6b]/15 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-[#1a3a6b] text-sm">Eigen foto&apos;s plaatsen?</p>
            <p className="text-gray-500 text-sm mt-0.5">
              De grijze placeholders worden eenvoudig vervangen door echte voor- en nafoto&apos;s van uw uitgevoerde projecten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
