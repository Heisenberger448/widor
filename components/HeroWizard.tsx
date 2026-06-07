'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Locatie = 'binnen' | 'buiten' | null;

interface Klus {
  id: string;
  label: string;
  eenheid: string; // 'm²' | 'stuks' | 'meter' | 'ja/nee'
  icon: string;
}

const BINNEN_KLUSSEN: Klus[] = [
  { id: 'muren', label: 'Muren', eenheid: 'm²', icon: '🧱' },
  { id: 'plafond', label: 'Plafond', eenheid: 'm²', icon: '⬆️' },
  { id: 'kozijnen_binnen', label: 'Kozijnen', eenheid: 'stuks', icon: '🪟' },
  { id: 'deuren_binnen', label: 'Deuren', eenheid: 'stuks', icon: '🚪' },
  { id: 'trappen', label: 'Trappen', eenheid: 'stuks', icon: '🪜' },
  { id: 'radiatoren', label: 'Radiatoren', eenheid: 'stuks', icon: '🔧' },
];

const BUITEN_KLUSSEN: Klus[] = [
  { id: 'gevel', label: 'Gevel', eenheid: 'm²', icon: '🏠' },
  { id: 'kozijnen_buiten', label: 'Kozijnen', eenheid: 'stuks', icon: '🪟' },
  { id: 'daklijsten', label: 'Daklijsten', eenheid: 'meter', icon: '📐' },
  { id: 'deuren_buiten', label: 'Deuren', eenheid: 'stuks', icon: '🚪' },
  { id: 'dakkapel', label: 'Dakkapel', eenheid: 'stuks', icon: '🏗️' },
  { id: 'schutting', label: 'Schutting/hek', eenheid: 'meter', icon: '🌿' },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBar({ step, total }: { step: number; total: number }) {
  const labels = ['Type werk', 'Klussen', 'Uw gegevens'];
  return (
    <div className="flex items-center gap-0 mb-6">
      {labels.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-[#1a3a6b] text-white'
                    : active
                    ? 'bg-[#f59e0b] text-gray-900'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {done ? (
                  <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${active ? 'text-[#1a3a6b]' : done ? 'text-[#1a3a6b]/60' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded ${num < step ? 'bg-[#1a3a6b]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Binnen of Buiten ─────────────────────────────────────────────────

function Step1({ value, onChange }: { value: Locatie; onChange: (v: Locatie) => void }) {
  const options: { id: Locatie; label: string; sub: string; svg: React.ReactNode }[] = [
    {
      id: 'binnen',
      label: 'Binnenschilderwerk',
      sub: 'Muren, plafonds, kozijnen, deuren',
      svg: (
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'buiten',
      label: 'Buitenschilderwerk',
      sub: 'Gevel, kozijnen, daklijsten, deuren',
      svg: (
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" strokeLinecap="round" />
          <line x1="12" y1="12" x2="12" y2="16" strokeLinecap="round" />
          <line x1="10" y1="14" x2="14" y2="14" strokeLinecap="round" />
        </svg>
      ),
    },
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-3">Wat voor schilderwerk heeft u nodig?</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-150 ${
              value === opt.id
                ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]'
                : 'border-gray-200 text-gray-500 hover:border-[#1a3a6b]/40 hover:bg-gray-50'
            }`}
          >
            <div className={`${value === opt.id ? 'text-[#1a3a6b]' : 'text-gray-400'}`}>{opt.svg}</div>
            <p className="font-bold text-sm leading-tight">{opt.label}</p>
            <p className="text-xs text-gray-400 leading-tight">{opt.sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Klussen + hoeveelheid ───────────────────────────────────────────

function Step2({
  locatie,
  selected,
  quantities,
  onToggle,
  onQuantityChange,
}: {
  locatie: Locatie;
  selected: string[];
  quantities: Record<string, number>;
  onToggle: (id: string) => void;
  onQuantityChange: (id: string, val: number) => void;
}) {
  const klussen = locatie === 'binnen' ? BINNEN_KLUSSEN : BUITEN_KLUSSEN;
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-3">
        Welke klussen wilt u laten uitvoeren?
      </p>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {klussen.map((klus) => {
          const isChecked = selected.includes(klus.id);
          const qty = quantities[klus.id] ?? (klus.eenheid === 'm²' ? 20 : klus.eenheid === 'meter' ? 10 : 1);
          return (
            <div key={klus.id} className={`rounded-xl border-2 transition-all duration-150 ${isChecked ? 'border-[#1a3a6b] bg-[#1a3a6b]/5' : 'border-gray-200 bg-white'}`}>
              {/* Checkbox row */}
              <label className="flex items-center gap-3 p-3 cursor-pointer select-none">
                <div
                  onClick={() => onToggle(klus.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isChecked ? 'bg-[#1a3a6b] border-[#1a3a6b]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isChecked && (
                    <svg width="11" height="11" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-lg">{klus.icon}</span>
                <span className={`font-semibold text-sm flex-1 ${isChecked ? 'text-[#1a3a6b]' : 'text-gray-700'}`}>
                  {klus.label}
                </span>
                {!isChecked && (
                  <span className="text-xs text-gray-400">{klus.eenheid}</span>
                )}
              </label>

              {/* Quantity slider — only shown when checked */}
              {isChecked && (
                <div className="px-4 pb-4 pt-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#1a3a6b]/70 font-medium">Hoeveelheid</span>
                    <span className="text-sm font-bold text-[#1a3a6b]">
                      {qty} {klus.eenheid}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={klus.eenheid === 'm²' ? 5 : klus.eenheid === 'meter' ? 2 : 1}
                    max={klus.eenheid === 'm²' ? 500 : klus.eenheid === 'meter' ? 100 : 20}
                    step={klus.eenheid === 'm²' ? 5 : 1}
                    value={qty}
                    onChange={(e) => onQuantityChange(klus.id, Number(e.target.value))}
                    className="w-full h-2 appearance-none rounded-full cursor-pointer accent-[#f59e0b]"
                    style={{
                      background: `linear-gradient(to right, #f59e0b ${((qty - (klus.eenheid === 'm²' ? 5 : 1)) / ((klus.eenheid === 'm²' ? 500 : klus.eenheid === 'meter' ? 100 : 20) - (klus.eenheid === 'm²' ? 5 : 1))) * 100}%, #e5e7eb ${((qty - (klus.eenheid === 'm²' ? 5 : 1)) / ((klus.eenheid === 'm²' ? 500 : klus.eenheid === 'meter' ? 100 : 20) - (klus.eenheid === 'm²' ? 5 : 1))) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>{klus.eenheid === 'm²' ? '5 m²' : klus.eenheid === 'meter' ? '2 m' : '1 stuk'}</span>
                    <span>{klus.eenheid === 'm²' ? '500 m²' : klus.eenheid === 'meter' ? '100 m' : '20 stuks'}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 3: Gegevens ─────────────────────────────────────────────────────────

function Step3({
  data,
  onChange,
}: {
  data: { naam: string; telefoon: string; postcode: string; email: string };
  onChange: (field: string, val: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 mb-3">
        Uw gegevens — ontvang een prijsindicatie
      </p>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Naam *</label>
            <input
              type="text"
              required
              value={data.naam}
              onChange={(e) => onChange('naam', e.target.value)}
              placeholder="Uw naam"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Telefoon *</label>
            <input
              type="tel"
              required
              value={data.telefoon}
              onChange={(e) => onChange('telefoon', e.target.value)}
              placeholder="06-00 000 000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Postcode *</label>
            <input
              type="text"
              required
              value={data.postcode}
              onChange={(e) => onChange('postcode', e.target.value)}
              placeholder="1234 AB"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="uw@email.nl"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
            />
          </div>
        </div>
        <div className="bg-[#1a3a6b]/5 rounded-lg p-3 flex gap-2">
          <svg width="16" height="16" fill="none" stroke="#1a3a6b" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-xs text-[#1a3a6b]/80 leading-relaxed">
            U ontvangt een <strong>vrijblijvende prijsindicatie</strong> op basis van uw keuzes.
            Wij nemen binnen 1 werkdag contact op.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Confirmation ─────────────────────────────────────────────────────────────

function Confirmation({ naam }: { naam: string }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="30" height="30" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-black text-[#1a3a6b] text-xl mb-2">Aanvraag ontvangen!</h3>
      <p className="text-gray-500 text-sm leading-relaxed">
        Bedankt {naam ? <strong>{naam}</strong> : 'voor uw aanvraag'}!<br />
        Wij sturen u binnen 1 werkdag een prijsindicatie.
      </p>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function HeroWizard() {
  const [step, setStep] = useState(1);
  const [locatie, setLocatie] = useState<Locatie>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [gegevens, setGegevens] = useState({ naam: '', telefoon: '', postcode: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleKlus = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const setQty = (id: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };

  const setGegeven = (field: string, val: string) => {
    setGegevens((prev) => ({ ...prev, [field]: val }));
  };

  const canNext = () => {
    if (step === 1) return locatie !== null;
    if (step === 2) return selected.length > 0;
    if (step === 3) return gegevens.naam && gegevens.telefoon && gegevens.postcode;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1);
    else setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-[#f59e0b] px-6 py-4">
        <p className="text-[#1a3a6b]/70 text-xs font-bold uppercase tracking-widest mb-0.5">Vrijblijvend</p>
        <h2 className="text-[#1a3a6b] font-black text-lg leading-tight">Bereken uw prijsindicatie</h2>
      </div>

      <div className="px-6 pt-5 pb-6">
        {submitted ? (
          <Confirmation naam={gegevens.naam} />
        ) : (
          <>
            <StepBar step={step} total={3} />

            {step === 1 && (
              <Step1 value={locatie} onChange={(v) => { setLocatie(v); setSelected([]); }} />
            )}
            {step === 2 && (
              <Step2
                locatie={locatie}
                selected={selected}
                quantities={quantities}
                onToggle={toggleKlus}
                onQuantityChange={setQty}
              />
            )}
            {step === 3 && (
              <Step3 data={gegevens} onChange={setGegeven} />
            )}

            {/* Nav buttons */}
            <div className="flex gap-3 mt-5">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 border-2 border-gray-200 hover:border-[#1a3a6b]/40 text-gray-600 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  ← Terug
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canNext()}
                className={`flex-1 font-bold py-2.5 rounded-lg text-sm transition-all ${
                  canNext()
                    ? 'bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 hover:-translate-y-0.5 shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {step === 3 ? 'Prijsindicatie ontvangen →' : 'Volgende stap →'}
              </button>
            </div>

            {/* Trust line */}
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Uw gegevens worden niet gedeeld met derden
            </p>
          </>
        )}
      </div>
    </div>
  );
}
