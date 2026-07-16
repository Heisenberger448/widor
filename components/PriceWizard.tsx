'use client';

import { useEffect, useMemo, useState } from 'react';
import rawData from './wizard/vragenboom.json';
import regioData from './wizard/veiligheidsregios.json';

/* eslint-disable @typescript-eslint/no-explicit-any */
const data: any = rawData;

const REGIONS: { id: string; name: string; path: string }[] = (regioData as any).regions;
const REGION_VIEWBOX: string = (regioData as any).viewBox;
const REGION_NAMES: Record<string, string> = Object.fromEntries(REGIONS.map((r) => [r.id, r.name]));

type Answers = Record<string, any>;

// ─── Condition evaluator ────────────────────────────────────────────────────

function evalLeaf(cond: any, ans: Answers): boolean {
  const val = ans[cond.field];
  if ('equals' in cond) return val === cond.equals;
  if ('not_equals' in cond) return val !== cond.not_equals;
  if ('includes' in cond) return Array.isArray(val) ? val.includes(cond.includes) : val === cond.includes;
  if ('not_includes' in cond) return Array.isArray(val) ? !val.includes(cond.not_includes) : val !== cond.not_includes;
  if ('in' in cond) return cond.in.includes(val);
  if ('includes_any' in cond) return Array.isArray(val) && cond.includes_any.some((x: any) => val.includes(x));
  if ('gt' in cond) return Number(val) > cond.gt;
  if ('gte' in cond) return Number(val) >= cond.gte;
  return true;
}

function evalCond(cond: any, ans: Answers): boolean {
  if (!cond) return true;
  if (cond.all) return cond.all.every((c: any) => evalCond(c, ans));
  if (cond.any) return cond.any.some((c: any) => evalCond(c, ans));
  if ('field' in cond) return evalLeaf(cond, ans);
  return true;
}

// ─── Screen builder ─────────────────────────────────────────────────────────

interface DetailItem {
  moduleTitle: string;
  question: any;
}

interface Screen {
  kind: 'question' | 'estimate' | 'details';
  phase: string;
  title: string;
  question?: any;
  items?: DetailItem[];
}

function buildScreens(ans: Answers): Screen[] {
  const screens: Screen[] = [];
  for (const phase of data.flow as string[]) {
    if (phase === 'component_details') {
      // Alle hoeveelheden op één scherm i.p.v. een apart scherm per onderdeel.
      const order: string[] = data.steps.component_details.module_order || [];
      const items: DetailItem[] = [];
      for (const key of order) {
        const mod = data.modules[key];
        if (!mod || !evalCond(mod.activation, ans)) continue;
        for (const q of mod.questions) {
          if (evalCond(q.show_if, ans)) items.push({ moduleTitle: mod.title, question: q });
        }
      }
      if (items.length) screens.push({ kind: 'details', phase, title: data.steps.component_details.title, items });
      continue;
    }
    const step = data.steps[phase];
    if (!step) continue;
    if (phase === 'estimate') {
      screens.push({ kind: 'estimate', phase, title: step.title });
      continue;
    }
    if (step.show_if && !evalCond(step.show_if, ans)) continue;
    for (const q of step.questions || []) {
      if (evalCond(q.show_if, ans)) screens.push({ kind: 'question', phase, title: step.title, question: q });
    }
  }
  return screens;
}

// ─── Validation ─────────────────────────────────────────────────────────────

function scalarOk(q: any, v: any): boolean {
  if (v === undefined || v === null || v === '') return false;
  if (q.type === 'number' || q.type === 'decimal') {
    const n = Number(String(v).replace(',', '.'));
    if (isNaN(n)) return false;
    if (q.min !== undefined && n < q.min) return false;
  }
  if (q.format === 'email') return /.+@.+\..+/.test(String(v));
  return true;
}

function isAnswered(q: any, ans: Answers): boolean {
  if (!q) return true;
  // Foto-stap: er moet een keuze gemaakt zijn — minstens één foto óf "ga verder zonder foto's".
  if (q.type === 'component_photos') {
    const v = ans[q.id] || {};
    const anyPhotos = Object.entries(v).some(([k, f]) => k !== '__skip' && Array.isArray(f) && f.length > 0);
    return anyPhotos || v.__skip === true;
  }
  // Opmerkingen-stap: tekst ingevuld óf "geen verdere opmerkingen" gekozen.
  if (q.type === 'remarks') {
    const text = (ans[q.id] ?? '').toString().trim();
    return text.length > 0 || ans[`${q.id}_NONE`] === true;
  }
  // Regio-stap: regio op de kaart gekozen óf een plaats/postcode ingevuld.
  if (q.type === 'region_map') {
    if (ans[q.id]) return true;
    return (ans[q.postcode_id || 'REGION_POSTCODE'] ?? '').toString().trim().length > 0;
  }
  if (q.required === false) return true;
  if (q.type === 'summary') return true;
  const v = ans[q.id];
  switch (q.type) {
    case 'single_choice': {
      if (!scalarOk(q, v)) return false;
      // Optie met inline tekstveld (bv. "Iets anders") vereist ook ingevulde tekst.
      const opt = (q.options || []).find((o: any) => o.value === v);
      if (opt?.allow_text && opt.text_id) return (ans[opt.text_id] ?? '').toString().trim().length > 0;
      return true;
    }
    case 'multi_choice':
      return Array.isArray(v) && v.length > 0;
    case 'address':
      return !!(v && v.postal_code && v.house_number);
    case 'file_upload':
      return !q.required || (Array.isArray(v) && v.length > 0);
    case 'repeatable_group': {
      const rows: any[] = Array.isArray(v) ? v : [];
      if (rows.length === 0) return false;
      const reqFields = (q.fields || []).filter((f: any) => f.required !== false);
      return rows.every((row) => reqFields.every((f: any) => (evalCond(f.show_if, row) ? scalarOk(f, row[f.id]) : true)));
    }
    default:
      return scalarOk(q, v);
  }
}

// ─── Selected components (for per-component photo uploads) ─────────────────

function selectedComponents(ans: Answers): { value: string; label: string }[] {
  const qs = data.steps.component_selection?.questions || [];
  const out: { value: string; label: string }[] = [];
  for (const q of qs) {
    const sel: string[] = Array.isArray(ans[q.id]) ? ans[q.id] : [];
    for (const opt of q.options || []) {
      if (sel.includes(opt.value)) {
        const suffix = q.id === 'OUTSIDE_COMPONENTS' ? ' (buiten)' : q.id === 'INSIDE_COMPONENTS' ? ' (binnen)' : '';
        out.push({ value: `${q.id}:${opt.value}`, label: `${opt.label}${suffix}` });
      }
    }
  }
  return out;
}

// ─── Confidence ─────────────────────────────────────────────────────────────

function confidenceLevel(ans: Answers): string {
  const photos = ans.COMPONENT_PHOTOS || {};
  const photoCount = Object.values(photos).reduce((n: number, files: any) => n + (Array.isArray(files) ? files.length : 0), 0);
  return photoCount > 0 ? 'high' : 'medium';
}

function optionLabel(q: any, value: any): string {
  const opt = (q.options || []).find((o: any) => o.value === value);
  return opt ? opt.label : String(value);
}

// ─── Option icons (square choice cards) ─────────────────────────────────────

const IC = {
  width: 44, height: 44, fill: 'none', stroke: 'currentColor', strokeWidth: 1.5,
  viewBox: '0 0 24 24', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
};

const OPTION_ICONS: Record<string, React.ReactElement> = {
  // Type pand
  home: <svg {...IC}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></svg>,
  business: <svg {...IC}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" /></svg>,
  vve: <svg {...IC}><rect x="3" y="8" width="8" height="13" rx="1" /><rect x="13" y="3" width="8" height="18" rx="1" /><path d="M6 12h2M6 16h2M16 7h2M16 11h2M16 15h2" /></svg>,
  other: <svg {...IC}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.2a2.5 2.5 0 1 1 3.6 2.3c-.8.5-1.1 1-1.1 1.8" /><path d="M12 17h.01" /></svg>,
  // Waar
  inside: <svg {...IC}><path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" /><path d="M2 13a2 2 0 0 1 4 0v3h12v-3a2 2 0 0 1 4 0v5H2z" /></svg>,
  outside: <svg {...IC}><path d="M3 21V8l9-5 9 5v13" /><path d="M3 21h18" /><rect x="7" y="12" width="4" height="4" /><rect x="13" y="12" width="4" height="4" /></svg>,
  both: <svg {...IC}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" /></svg>,
  // Binnen
  walls: <svg {...IC}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 9.5h18M3 14.5h18M9 5v4.5M15 9.5v5M9 14.5V19" /></svg>,
  ceilings: <svg {...IC}><path d="M4 5h16" /><path d="M12 5v4" /><path d="M8.5 13a3.5 3.5 0 0 1 7 0z" /></svg>,
  inside_window_frames: <svg {...IC}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M12 3v18M4 12h16" /></svg>,
  inside_doors: <svg {...IC}><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="14.5" cy="12" r="1" /></svg>,
  radiators: <svg {...IC}><rect x="4" y="6" width="16" height="12" rx="1" /><path d="M8 6v12M12 6v12M16 6v12M6 18v2M18 18v2" /></svg>,
  stairs: <svg {...IC}><path d="M3 21v-4h4v-4h4v-4h4v-4h5" /></svg>,
  skirting: <svg {...IC}><path d="M5 5v14h14" /><path d="M5 16h14" /></svg>,
  other_inside: <svg {...IC}><circle cx="6" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="18" cy="12" r="1.4" /></svg>,
  // Buiten
  outside_window_frames: <svg {...IC}><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M12 3v18M4 12h16" /></svg>,
  outside_doors: <svg {...IC}><rect x="6" y="3" width="12" height="18" rx="1" /><circle cx="14.5" cy="12" r="1" /></svg>,
  fascia: <svg {...IC}><path d="M3 10l9-6 9 6" /><path d="M3 10v3h18v-3" /><path d="M6 13v7M18 13v7" /></svg>,
  dormer: <svg {...IC}><path d="M2 12l10-7 10 7" /><path d="M5 11v9h14v-9" /><rect x="9.5" y="4.5" width="5" height="4.5" /></svg>,
  cladding: <svg {...IC}><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M4 8.5h16M4 12h16M4 15.5h16" /></svg>,
  painted_masonry: <svg {...IC}><rect x="3" y="5" width="18" height="14" rx="1" /><path d="M3 9.5h18M3 14.5h18M9 5v4.5M15 9.5v5M9 14.5V19" /></svg>,
  garage_door: <svg {...IC}><path d="M3 21V9l9-5 9 5v12" /><rect x="6" y="11" width="12" height="10" /><path d="M6 14.5h12M6 18h12" /></svg>,
  other_outside: <svg {...IC}><circle cx="6" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="18" cy="12" r="1.4" /></svg>,
  // Planning
  asap: <svg {...IC}><path d="M13 2L4 14h6l-1 8 9-12h-6z" /></svg>,
  three_months: <svg {...IC}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>,
  six_months: <svg {...IC}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>,
  later: <svg {...IC}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5l3 2" /></svg>,
  orientation: <svg {...IC}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></svg>,
};

const FALLBACK_ICON = (
  <svg {...IC}><circle cx="12" cy="12" r="9" /><path d="M12 8v.01M12 11v5" /></svg>
);

function iconFor(value: string): React.ReactElement {
  return OPTION_ICONS[value] || FALLBACK_ICON;
}

// Kaarten kleiner maken (meer kolommen, kleinere iconen/tekst) bij veel opties,
// zodat ze zonder scrollen in de pop-up passen.
function gridLayout(n: number) {
  if (n >= 7) return { grid: 'grid-cols-3 sm:grid-cols-4 gap-2', icon: '[&>svg]:w-8 [&>svg]:h-8', text: 'text-xs', pad: 'p-1.5 gap-1.5' };
  if (n >= 5) return { grid: 'grid-cols-2 sm:grid-cols-3 gap-2.5', icon: '[&>svg]:w-9 [&>svg]:h-9', text: 'text-xs', pad: 'p-2 gap-2' };
  return { grid: 'grid-cols-2 sm:grid-cols-3 gap-2.5', icon: '[&>svg]:w-11 [&>svg]:h-11', text: 'text-sm', pad: 'p-2 gap-2.5' };
}

// ─── Small field primitives ─────────────────────────────────────────────────

function Choices({ q, value, onSelect, plain, answers, setAnswer }: { q: any; value: any; onSelect: (v: string) => void; plain?: boolean; answers?: Answers; setAnswer?: (id: string, v: any) => void }) {
  if (plain) {
    return (
      <div className="space-y-2">
        {q.options.map((opt: any) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                active ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]' : 'border-gray-200 text-gray-600 hover:border-[#1a3a6b]/40 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }
  const L = gridLayout(q.options.length);
  return (
    <div className={`grid ${L.grid}`}>
      {q.options.map((opt: any) => {
        const active = value === opt.value;
        // Optie met inline tekstveld (bv. "Iets anders"): direct in de kaart typen.
        if (opt.allow_text) {
          const text = answers?.[opt.text_id] ?? '';
          return (
            <div
              key={opt.value}
              onClick={() => { if (!active) onSelect(opt.value); }}
              className={`aspect-square flex flex-col items-center justify-center text-center rounded-2xl border-2 cursor-pointer transition-all ${L.pad} ${
                active ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]' : 'border-gray-200 text-gray-500 hover:border-[#1a3a6b]/40 hover:bg-gray-50 hover:text-[#1a3a6b]'
              }`}
            >
              <span className={`${L.icon} ${active ? 'text-[#1a3a6b]' : 'text-[#1a3a6b]/70'}`}>{iconFor(opt.value)}</span>
              <span className={`${L.text} font-semibold leading-snug px-1 ${active ? 'text-[#1a3a6b]' : 'text-gray-600'}`}>{opt.label}</span>
              <input
                type="text"
                value={text}
                placeholder={opt.text_placeholder || ''}
                onClick={(e) => e.stopPropagation()}
                onFocus={() => { if (!active) onSelect(opt.value); }}
                onChange={(e) => { if (!active) onSelect(opt.value); setAnswer?.(opt.text_id, e.target.value); }}
                className="mt-1.5 w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
              />
            </div>
          );
        }
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={`aspect-square flex flex-col items-center justify-center text-center rounded-2xl border-2 transition-all ${L.pad} ${
              active
                ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]'
                : 'border-gray-200 text-gray-500 hover:border-[#1a3a6b]/40 hover:bg-gray-50 hover:text-[#1a3a6b]'
            }`}
          >
            <span className={`${L.icon} ${active ? 'text-[#1a3a6b]' : 'text-[#1a3a6b]/70'}`}>{iconFor(opt.value)}</span>
            <span className={`${L.text} font-semibold leading-snug px-1 ${active ? 'text-[#1a3a6b]' : 'text-gray-600'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiChoices({ q, value, onChange }: { q: any; value: string[]; onChange: (v: string[]) => void }) {
  const selected = Array.isArray(value) ? value : [];
  const toggle = (val: string) => {
    const noneVals = ['none'];
    if (noneVals.includes(val)) return onChange(selected.includes(val) ? [] : [val]);
    const next = selected.includes(val) ? selected.filter((x) => x !== val) : [...selected.filter((x) => !noneVals.includes(x)), val];
    onChange(next);
  };
  const L = gridLayout(q.options.length);
  return (
    <div className={`grid ${L.grid}`}>
      {q.options.map((opt: any) => {
        const active = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`relative aspect-square flex flex-col items-center justify-center text-center rounded-2xl border-2 transition-all ${L.pad} ${
              active
                ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]'
                : 'border-gray-200 text-gray-500 hover:border-[#1a3a6b]/40 hover:bg-gray-50 hover:text-[#1a3a6b]'
            }`}
          >
            <span className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'bg-[#1a3a6b] border-[#1a3a6b]' : 'border-gray-300'}`}>
              {active && <svg width="11" height="11" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            <span className={`${L.icon} ${active ? 'text-[#1a3a6b]' : 'text-[#1a3a6b]/70'}`}>{iconFor(opt.value)}</span>
            <span className={`${L.text} font-semibold leading-snug px-1 ${active ? 'text-[#1a3a6b]' : 'text-gray-600'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Scalar({ q, value, onChange }: { q: any; value: any; onChange: (v: any) => void }) {
  const common = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]';
  if (q.type === 'text' && q.multiline) {
    return <textarea rows={3} className={common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  if (q.type === 'text') {
    const inputType = q.format === 'email' ? 'email' : q.format === 'tel' ? 'tel' : 'text';
    return <input type={inputType} className={common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  if (q.type === 'date') {
    return <input type="date" className={common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  // number / decimal
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        inputMode={q.type === 'decimal' ? 'decimal' : 'numeric'}
        step={q.type === 'decimal' ? 'any' : 1}
        min={q.min}
        className={common}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      {q.unit && <span className="text-sm text-gray-400 shrink-0">{q.unit}</span>}
    </div>
  );
}

function AddressInput({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const v = value || {};
  const set = (k: string, val: string) => onChange({ ...v, [k]: val });
  const cls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]';
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Postcode</label>
        <input className={cls} placeholder="1234 AB" value={v.postal_code ?? ''} onChange={(e) => set('postal_code', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Huisnummer</label>
        <input className={cls} value={v.house_number ?? ''} onChange={(e) => set('house_number', e.target.value)} />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Toevoeging</label>
        <input className={cls} value={v.addition ?? ''} onChange={(e) => set('addition', e.target.value)} />
      </div>
    </div>
  );
}

// Renders a single scalar/choice sub-field (used inside repeatable groups)
function SubField({ f, value, onChange }: { f: any; value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {f.text}{f.unit ? ` (${f.unit})` : ''}
      </label>
      {f.type === 'single_choice' ? (
        <Choices q={f} value={value} onSelect={onChange} plain />
      ) : f.type === 'multi_choice' ? (
        <MultiChoices q={f} value={value} onChange={onChange} />
      ) : (
        <Scalar q={f} value={value} onChange={onChange} />
      )}
    </div>
  );
}

function RepeatableGroup({ q, value, onChange, ans }: { q: any; value: any; onChange: (v: any[]) => void; ans: Answers }) {
  // Determine the set of rows
  let rows: any[] = Array.isArray(value) ? value : [];

  const fixed = q.fixed_rows as any[] | undefined;
  const repeatCount = q.repeat_from ? Math.max(0, Math.min(20, Number(ans[q.repeat_from]) || 0)) : undefined;

  // Initialise rows for fixed_rows / repeat_from
  if (fixed && rows.length !== fixed.length) {
    rows = fixed.map((r, i) => ({ _label: r.label, _value: r.value, ...(rows[i] || {}) }));
  } else if (repeatCount !== undefined && rows.length !== repeatCount) {
    rows = Array.from({ length: repeatCount }, (_, i) => rows[i] || {});
  }

  const update = (i: number, patch: any) => {
    const next = rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    onChange(next);
  };

  const freeAdd = !fixed && !q.repeat_from;

  return (
    <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
      {rows.map((row, i) => (
        <div key={i} className="border-2 border-gray-100 rounded-xl p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-[#1a3a6b]">
              {fixed ? row._label : `${q.item_label || 'Item'} ${i + 1}`}
            </p>
            {freeAdd && rows.length > 1 && (
              <button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:underline">
                Verwijderen
              </button>
            )}
          </div>
          {fixed ? (
            <Scalar q={q.fields[0]} value={row[q.fields[0].id]} onChange={(v) => update(i, { [q.fields[0].id]: v })} />
          ) : (
            q.fields.map((f: any) =>
              evalCond(f.show_if, row) ? (
                <SubField key={f.id} f={f} value={row[f.id]} onChange={(v) => update(i, { [f.id]: v })} />
              ) : null
            )
          )}
        </div>
      ))}
      {freeAdd && (
        <button type="button" onClick={() => onChange([...rows, {}])} className="w-full border-2 border-dashed border-[#1a3a6b]/30 text-[#1a3a6b] font-semibold text-sm py-2.5 rounded-xl hover:bg-[#1a3a6b]/5">
          + {q.item_label || 'Item'} toevoegen
        </button>
      )}
    </div>
  );
}

function FileUpload({ q, value, onChange }: { q: any; value: any; onChange: (v: any[]) => void }) {
  const files: File[] = Array.isArray(value) ? value : [];
  return (
    <div>
      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#1a3a6b]/40">
        <input
          type="file"
          multiple
          accept={(q.accept || []).join(',')}
          className="hidden"
          onChange={(e) => onChange([...files, ...Array.from(e.target.files || [])].slice(0, q.max_files || 20))}
        />
        <svg width="28" height="28" fill="none" stroke="#9ca3af" strokeWidth="1.8" viewBox="0 0 24 24" className="mx-auto mb-2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 5v12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm text-gray-500">Klik om foto&apos;s te kiezen (max. {q.max_files})</span>
      </label>
      {files.length > 0 && <p className="text-xs text-[#1a3a6b] mt-2 font-medium">{files.length} foto&apos;s geselecteerd</p>}
    </div>
  );
}

// Per gekozen onderdeel (plafond, raamkozijn, …) een eigen foto-upload
function ComponentPhotos({ value, onChange, ans }: { value: any; onChange: (v: any) => void; ans: Answers }) {
  const comps = selectedComponents(ans);
  const photos: Record<string, any> = value || {};
  const [dragKey, setDragKey] = useState<string | null>(null);
  const skip = photos.__skip === true;

  const addFiles = (key: string, incoming: File[]) => {
    const current: File[] = Array.isArray(photos[key]) ? photos[key] : [];
    const imgs = incoming.filter((f) => f.type.startsWith('image/'));
    // Foto toevoegen wist de "zonder foto's"-keuze.
    onChange({ ...photos, __skip: false, [key]: [...current, ...imgs].slice(0, 5) });
  };
  const toggleSkip = () => onChange({ ...photos, __skip: !skip });

  if (comps.length === 0) {
    return <p className="text-sm text-gray-400">Geen onderdelen geselecteerd.</p>;
  }

  const L = gridLayout(comps.length);
  const dense = comps.length >= 7;
  const arrow = dense ? 15 : 19;
  return (
    <div>
      <p className="text-xs text-gray-400 leading-relaxed mb-3">Sleep foto&apos;s in een onderdeel of klik om te kiezen · JPG, PNG of WebP</p>
      <div className={`grid ${L.grid}`}>
        {comps.map((c) => {
          const files = photos[c.value] || [];
          const has = files.length > 0;
          const active = dragKey === c.value;
          const optValue = c.value.split(':').pop() || '';
          return (
            <label
              key={c.value}
              onDragOver={(e) => { e.preventDefault(); if (dragKey !== c.value) setDragKey(c.value); }}
              onDragLeave={(e) => { e.preventDefault(); setDragKey((k) => (k === c.value ? null : k)); }}
              onDrop={(e) => { e.preventDefault(); setDragKey(null); addFiles(c.value, Array.from(e.dataTransfer.files || [])); }}
              className={`relative aspect-square flex flex-col items-center text-center rounded-2xl border-2 cursor-pointer transition-all ${L.pad} ${
                has || active ? 'border-[#1a3a6b] bg-[#1a3a6b]/5' : 'border-gray-200 hover:border-[#1a3a6b]/40 hover:bg-gray-50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => addFiles(c.value, Array.from(e.target.files || []))}
              />
              {/* Hoekbadge met het aantal toegevoegde foto's */}
              {has && (
                <span className="absolute top-1.5 right-1.5 min-w-5 h-5 px-1 rounded-full bg-green-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {files.length}
                </span>
              )}
              {/* Icoon + label bovenin, vult de ruimte zodat het upload-vlak onderaan uitlijnt */}
              <span className="flex-1 min-h-0 flex flex-col items-center justify-center gap-1.5">
                <span className={`${L.icon} ${has || active ? 'text-[#1a3a6b]' : 'text-[#1a3a6b]/70'}`}>{iconFor(optValue)}</span>
                <span className={`${L.text} font-semibold leading-snug px-1 ${has || active ? 'text-[#1a3a6b]' : 'text-gray-600'}`}>{c.label}</span>
              </span>
              {/* Breed vakje met gestippelde rand, upload-logo en tekst — onderaan uitgelijnd */}
              <span
                className={`w-full shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed py-1.5 transition-all ${
                  active ? 'border-[#1a3a6b] bg-[#1a3a6b]/10 text-[#1a3a6b]' : has ? 'border-[#1a3a6b]/40 text-[#1a3a6b]/70' : 'border-gray-300 text-gray-400'
                }`}
              >
                <svg width={arrow} height={arrow} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 5v12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[10px] font-semibold leading-none">Upload Foto</span>
              </span>
            </label>
          );
        })}

        {/* Doorgaan zonder foto's — selecteerbare keuze */}
        <button
          type="button"
          onClick={toggleSkip}
          className={`relative aspect-square flex flex-col items-center justify-center text-center rounded-2xl border-2 transition-all ${L.pad} ${
            skip ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]' : 'border-gray-200 text-gray-500 hover:border-[#1a3a6b]/40 hover:bg-gray-50 hover:text-[#1a3a6b]'
          }`}
        >
          <span className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${skip ? 'bg-[#1a3a6b] border-[#1a3a6b]' : 'border-gray-300'}`}>
            {skip && <svg width="11" height="11" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className={`${L.icon} ${skip ? 'text-[#1a3a6b]' : ''}`}>
            <svg {...IC} stroke="currentColor">
              <circle cx="12" cy="12" r="9" />
              <path d="M10.5 8.5l3.5 3.5-3.5 3.5" />
            </svg>
          </span>
          <span className={`${L.text} font-semibold leading-snug px-1`}>Ga verder zonder foto&apos;s</span>
        </button>
      </div>
    </div>
  );
}

// ─── Summary ────────────────────────────────────────────────────────────────

function readableValue(q: any, v: any): string {
  if (v === undefined || v === null || v === '') return '—';
  if (q.type === 'single_choice') return optionLabel(q, v);
  if (q.type === 'region_map') return REGION_NAMES[v] || String(v);
  if (q.type === 'multi_choice') return Array.isArray(v) ? v.map((x) => optionLabel(q, x)).join(', ') : String(v);
  if (q.type === 'address') return [v.postal_code, v.house_number, v.addition].filter(Boolean).join(' ');
  if (q.type === 'file_upload') return Array.isArray(v) ? `${v.length} foto's` : '—';
  if (q.type === 'component_photos') {
    const n = Object.values(v || {}).reduce((s: number, f: any) => s + (Array.isArray(f) ? f.length : 0), 0);
    return n > 0 ? `${n} foto's` : '—';
  }
  if (q.type === 'repeatable_group') return `${Array.isArray(v) ? v.length : 0} ingevuld`;
  return `${v}${q.unit ? ' ' + q.unit : ''}`;
}

function Summary({ ans }: { ans: Answers }) {
  const isFilled = (q: any): boolean => {
    if (q.type === 'region_map') {
      return !!ans[q.id] || (ans[q.postcode_id || 'REGION_POSTCODE'] ?? '').toString().trim().length > 0;
    }
    return ans[q.id] !== undefined && ans[q.id] !== '';
  };
  const rows = buildScreens(ans)
    .filter((s) => s.kind === 'question' && s.question.type !== 'summary' && isFilled(s.question))
    .map((s) => s.question);
  // Bij een keuze met inline tekst (bv. "Iets anders") de ingetypte tekst tonen.
  const displayValue = (q: any): string => {
    if (q.type === 'single_choice') {
      const opt = (q.options || []).find((o: any) => o.value === ans[q.id]);
      const typed = (ans[opt?.text_id] ?? '').toString().trim();
      if (opt?.allow_text && typed) return `${opt.label}: ${typed}`;
    }
    if (q.type === 'region_map') {
      if (ans[q.id]) return REGION_NAMES[ans[q.id]] || String(ans[q.id]);
      const pc = (ans[q.postcode_id || 'REGION_POSTCODE'] ?? '').toString().trim();
      return pc || '—';
    }
    return readableValue(q, ans[q.id]);
  };
  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      {rows.map((q) =>
        q.type === 'remarks' ? (
          // Opmerkingen: tekst onder het kopje, over de volle breedte.
          <div key={q.id} className="text-sm border-b border-gray-100 pb-1.5">
            <p className="text-gray-500 mb-0.5">{q.text}</p>
            <p className="font-semibold text-[#1a3a6b] whitespace-pre-wrap">{readableValue(q, ans[q.id])}</p>
          </div>
        ) : (
          <div key={q.id} className="flex justify-between gap-3 text-sm border-b border-gray-100 pb-1.5">
            <span className="text-gray-500">{q.text}</span>
            <span className="font-semibold text-[#1a3a6b] text-right">{displayValue(q)}</span>
          </div>
        )
      )}
    </div>
  );
}

const CONFIDENCE_STYLE: Record<string, { label: string; cls: string }> = {
  high: { label: 'Hoge betrouwbaarheid', cls: 'bg-green-100 text-green-700' },
  medium: { label: 'Redelijke betrouwbaarheid', cls: 'bg-amber-100 text-amber-700' },
  low: { label: 'Lage betrouwbaarheid', cls: 'bg-orange-100 text-orange-700' },
  inspection_required: { label: 'Opname aanbevolen', cls: 'bg-[#1a3a6b]/10 text-[#1a3a6b]' },
};

// ─── Entry: teaser card + modal popup ──────────────────────────────────────

export default function PriceWizard() {
  const [open, setOpen] = useState(false);

  // Lock page scroll + close on Escape while the popup is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {/* Teaser card shown in the hero */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
        <div className="bg-[#f59e0b] px-6 py-4">
          <p className="text-[#1a3a6b]/70 text-xs font-bold uppercase tracking-widest mb-0.5">Vrijblijvend</p>
          <h2 className="text-[#1a3a6b] font-black text-lg leading-tight">Bereken uw prijsindicatie</h2>
        </div>
        <div className="px-6 py-6">
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            Beantwoord een paar korte vragen over uw schilderwerk en ontvang binnen 1 werkdag een prijsindicatie op maat. U zit nergens aan vast.
          </p>
          <ul className="space-y-2 mb-6">
            {['In een paar minuten klaar', 'Volledig vrijblijvend', 'Persoonlijke indicatie op maat'].map((t) => (
              <li key={t} className="flex items-center gap-2.5 text-sm text-[#1a3a6b] font-medium">
                <svg width="16" height="16" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold py-3.5 rounded-lg text-sm transition-all hover:-translate-y-0.5 shadow-md"
          >
            Start prijsindicatie →
          </button>
        </div>
      </div>

      {/* Popup */}
      {open && (
        <div
          className="fixed inset-0 z-100 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="w-full max-w-2xl my-auto" onClick={(e) => e.stopPropagation()}>
            <WizardFlow onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main wizard ────────────────────────────────────────────────────────────

function WizardFlow({ onClose }: { onClose: () => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const screens = useMemo(() => buildScreens(answers), [answers]);
  const total = screens.length;
  const idx = Math.min(step, total - 1);
  const current = screens[idx];

  const setAnswer = (id: string, v: any) => setAnswers((prev) => ({ ...prev, [id]: v }));

  const isLast = idx === total - 1;
  const canNext =
    current?.kind === 'estimate'
      ? true
      : current?.kind === 'details'
        ? (current.items || []).every((it) => isAnswered(it.question, answers))
        : isAnswered(current?.question, answers);

  const goNext = () => {
    if (isLast) setSubmitted(true);
    else setStep(idx + 1);
  };
  const goBack = () => setStep(Math.max(0, idx - 1));

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden relative">
        <CloseButton onClose={onClose} dark />
        <div className="px-6 py-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="30" height="30" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h3 className="font-black text-[#1a3a6b] text-xl mb-2">Aanvraag ontvangen!</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Bedankt! Wij sturen uw persoonlijke prijsindicatie binnen 1 werkdag{answers.EMAIL ? ` naar ${answers.EMAIL}` : ' per e-mail'}.
          </p>
          <button onClick={onClose} className="bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">
            Sluiten
          </button>
        </div>
      </div>
    );
  }

  const progress = total > 1 ? Math.round(((idx + 1) / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
      {/* Header */}
      <div className="bg-[#f59e0b] px-6 py-4 relative">
        <p className="text-[#1a3a6b]/70 text-xs font-bold uppercase tracking-widest mb-0.5">Vrijblijvend</p>
        <h2 className="text-[#1a3a6b] font-black text-lg leading-tight">Bereken uw prijsindicatie</h2>
        <CloseButton onClose={onClose} />
      </div>

      {/* Progress */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-[#1a3a6b]">{current?.title}</span>
          <span className="text-xs text-gray-400">Stap {idx + 1} / {total}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#f59e0b] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-5 overflow-y-auto">
        {current?.kind === 'estimate' ? (
          <EstimateScreen ans={answers} />
        ) : current?.kind === 'details' ? (
          <DetailsBody items={current.items || []} answers={answers} setAnswer={setAnswer} />
        ) : current?.question ? (
          <QuestionBody q={current.question} answers={answers} setAnswer={setAnswer} onAutoAdvance={goNext} />
        ) : null}
      </div>

      {/* Nav */}
      <div className="px-6 pb-6 pt-1 mt-auto border-t border-gray-50">
        <div className="flex gap-3 pt-4">
          {idx > 0 && (
            <button onClick={goBack} className="flex-1 border-2 border-gray-200 hover:border-[#1a3a6b]/40 text-gray-600 font-semibold py-2.5 rounded-lg text-sm transition-colors">
              ← Terug
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canNext}
            className={`flex-1 font-bold py-2.5 rounded-lg text-sm transition-all ${
              canNext ? 'bg-[#f59e0b] hover:bg-[#d97706] text-gray-900 hover:-translate-y-0.5 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLast ? 'Aanvraag versturen →' : current?.kind === 'estimate' ? 'Naar contactgegevens →' : 'Volgende →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseButton({ onClose, dark }: { onClose: () => void; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Sluiten"
      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        dark ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600' : 'text-[#1a3a6b]/70 hover:bg-black/10 hover:text-[#1a3a6b]'
      }`}
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
    </button>
  );
}

const PROCESS_STEPS = [
  {
    title: 'Prijsindicatie',
    desc: 'Op basis van uw antwoorden ontvangt u binnen 1 werkdag een vrijblijvende prijsindicatie per e-mail. Zo weet u snel en zonder verplichtingen waar u ongeveer aan toe bent.',
  },
  {
    title: 'Offerte',
    desc: 'Voor een exacte prijs plannen we een gratis opname op locatie. Samen bekijken we het werk en u ontvangt een heldere offerte met de werkzaamheden, de materialen en een scherpe prijs.',
  },
  {
    title: 'Planning',
    desc: 'Na uw akkoord plannen we het werk in op een moment dat u het beste uitkomt. U weet vooraf precies wanneer we beginnen en wanneer het klaar is.',
  },
  {
    title: 'Uitvoering',
    desc: 'Onze vakmensen gaan vakkundig aan de slag en houden de overlast tot een minimum beperkt. De werkplek laten we elke dag netjes en opgeruimd achter.',
  },
  {
    title: 'Evaluatie',
    desc: 'Na afronding lopen we het werk samen met u na, tot in de puntjes. Het project is voor ons pas klaar als u volledig tevreden bent — met garantie op ons vakwerk.',
  },
];

function ProcessSteps() {
  return (
    <div className="mb-5 rounded-2xl bg-[#1a3a6b]/[0.04] border border-[#1a3a6b]/10 px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#f59e0b] mb-3 text-center">Zo werken wij</p>
      <div>
        {PROCESS_STEPS.map((s, i) => {
          const active = i === 0;
          const isLast = i === PROCESS_STEPS.length - 1;
          return (
            <div key={s.title} className={`flex gap-3 relative ${isLast ? '' : 'pb-3'}`}>
              {!isLast && <span className="absolute left-[15px] top-8 -bottom-0.5 w-0.5 bg-[#1a3a6b]/15" />}
              <span
                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${
                  active ? 'bg-[#f59e0b] text-[#1a3a6b]' : 'bg-[#1a3a6b] text-white'
                }`}
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-sm font-bold text-[#1a3a6b] leading-tight">{s.title}</p>
                <p className="text-xs text-[#1a3a6b]/55 leading-snug mt-0.5">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RegionMap({ q, answers, setAnswer }: { q: any; answers: Answers; setAnswer: (id: string, v: any) => void }) {
  const postcodeId = q.postcode_id || 'REGION_POSTCODE';
  const value = answers[q.id];
  const postcode = answers[postcodeId] ?? '';

  const selectRegion = (id: string) => {
    setAnswer(q.id, id);
    if (postcode) setAnswer(postcodeId, ''); // regio óf postcode
  };
  const onPostcode = (v: string) => {
    setAnswer(postcodeId, v);
    if (v && value) setAnswer(q.id, '');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Legenda links: instructie + kleine invoer voor stad/dorp/postcode */}
      <div className="sm:w-64 shrink-0 flex flex-col justify-start">
        <p className="text-xs text-gray-500 leading-relaxed mb-2">Klik op uw regio op de kaart van Nederland, of vul hieronder uw stad, dorp of postcode in.</p>
        <input
          type="text"
          value={postcode}
          onChange={(e) => onPostcode(e.target.value)}
          placeholder="Bijv. Delft of 2611 AB"
          className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-left focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
        />
      </div>

      {/* Grote kaart rechts, maximale hoogte */}
      <div className="flex-1 min-w-0" style={{ height: '54vh' }}>
        <svg
          viewBox={REGION_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          role="group"
          aria-label="Kaart van Nederland met regio's"
        >
          {REGIONS.map((r) => {
            const sel = value === r.id;
            return (
              <path
                key={r.id}
                d={r.path}
                onClick={() => selectRegion(r.id)}
                strokeWidth={1}
                className={`cursor-pointer transition-colors stroke-white ${sel ? 'fill-[#d97706]' : 'fill-[#c9d5e8] hover:fill-[#f59e0b]'}`}
              >
                <title>{r.name}</title>
              </path>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function QuestionBody({ q, answers, setAnswer, onAutoAdvance }: { q: any; answers: Answers; setAnswer: (id: string, v: any) => void; onAutoAdvance: () => void }) {
  return (
    <div>
      {q.showProcess && <ProcessSteps />}
      <p className="text-base font-bold text-[#1a3a6b] mb-1 leading-snug">{q.text}</p>
      {q.required === false && q.type !== 'component_photos' && <p className="text-xs text-gray-400 mb-1">Optioneel</p>}
      {q.hint && <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">{q.hint}</p>}
      <div className="mt-3">
        {q.type === 'summary' ? (
          <Summary ans={answers} />
        ) : q.type === 'single_choice' ? (
          <Choices
            q={q}
            value={answers[q.id]}
            answers={answers}
            setAnswer={setAnswer}
            onSelect={(v) => {
              setAnswer(q.id, v);
              const opt = (q.options || []).find((o: any) => o.value === v);
              if (!opt?.allow_text) onAutoAdvance();
            }}
          />
        ) : q.type === 'multi_choice' ? (
          <MultiChoices q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        ) : q.type === 'address' ? (
          <AddressInput value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        ) : q.type === 'repeatable_group' ? (
          <RepeatableGroup q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} ans={answers} />
        ) : q.type === 'file_upload' ? (
          <FileUpload q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        ) : q.type === 'component_photos' ? (
          <ComponentPhotos value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} ans={answers} />
        ) : q.type === 'remarks' ? (
          <RemarksField q={q} answers={answers} setAnswer={setAnswer} />
        ) : q.type === 'region_map' ? (
          <RegionMap q={q} answers={answers} setAnswer={setAnswer} />
        ) : (
          <Scalar q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
        )}
      </div>
    </div>
  );
}

function CompactField({ q, value, onChange }: { q: any; value: any; onChange: (v: any) => void }) {
  const cls = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]';
  if (q.type === 'text') {
    return <input type="text" className={`${cls} w-44 text-center`} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
  // Aantallen krijgen "Stuks"; oppervlakte/lengte de eigen eenheid (m² / m).
  const unit = q.unit || (q.type === 'number' ? 'Stuks' : '');
  return (
    <div className="flex items-center gap-2 shrink-0">
      <input
        type="number"
        inputMode={q.type === 'decimal' ? 'decimal' : 'numeric'}
        step={q.type === 'decimal' ? 'any' : 1}
        min={q.min}
        className={`${cls} w-20 text-center`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-sm text-gray-400 w-12 shrink-0">{unit}</span>
    </div>
  );
}

function RemarksField({ q, answers, setAnswer }: { q: any; answers: Answers; setAnswer: (id: string, v: any) => void }) {
  const noneKey = `${q.id}_NONE`;
  const text = answers[q.id] ?? '';
  const none = answers[noneKey] === true;

  const onText = (v: string) => {
    setAnswer(q.id, v);
    if (v && none) setAnswer(noneKey, false); // typen wist de "geen opmerkingen"-keuze
  };
  const toggleNone = () => {
    const next = !none;
    setAnswer(noneKey, next);
    if (next) setAnswer(q.id, ''); // "geen opmerkingen" wist het tekstveld
  };

  return (
    <div>
      <textarea
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/25 focus:border-[#1a3a6b]"
        value={text}
        onChange={(e) => onText(e.target.value)}
      />
      <button
        type="button"
        onClick={toggleNone}
        className={`mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
          none ? 'border-[#1a3a6b] bg-[#1a3a6b]/5 text-[#1a3a6b]' : 'border-gray-200 text-gray-600 hover:border-[#1a3a6b]/40 hover:bg-gray-50'
        }`}
      >
        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${none ? 'bg-[#1a3a6b] border-[#1a3a6b]' : 'border-gray-300'}`}>
          {none && <svg width="11" height="11" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        </span>
        <span className="text-sm font-semibold">Ik heb geen verdere opmerkingen</span>
      </button>
    </div>
  );
}

function DetailsBody({ items, answers, setAnswer }: { items: DetailItem[]; answers: Answers; setAnswer: (id: string, v: any) => void }) {
  return (
    <div>
      <p className="text-base font-bold text-[#1a3a6b] mb-1 leading-snug">Vul de hoeveelheden in</p>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">Een grove schatting is prima — wij bepalen de exacte hoeveelheden tijdens de opname.</p>
      <div className="space-y-2.5 max-h-[52vh] overflow-y-auto pr-1">
        {items.map(({ moduleTitle, question }) => (
          <div key={question.id} className="flex items-center justify-between gap-3 border-2 border-gray-100 rounded-xl p-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1a3a6b] leading-snug">{moduleTitle}</p>
              <p className="text-xs text-gray-400 leading-snug">{question.text}</p>
            </div>
            <CompactField q={question} value={answers[question.id]} onChange={(v) => setAnswer(question.id, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EstimateScreen({ ans }: { ans: Answers }) {
  const level = confidenceLevel(ans);
  const style = CONFIDENCE_STYLE[level] || CONFIDENCE_STYLE.medium;
  const levelDesc = data.steps.estimate?.output?.confidence_levels?.[level];
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-[#1a3a6b]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="26" height="26" fill="none" stroke="#1a3a6b" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <h3 className="font-black text-[#1a3a6b] text-lg mb-2">Uw prijsindicatie is bijna klaar</h3>
      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${style.cls}`}>{style.label}</span>
      {levelDesc && <p className="text-gray-500 text-sm leading-relaxed mb-4">{levelDesc}</p>}
      <p className="text-gray-500 text-sm leading-relaxed">
        Op basis van uw antwoorden stellen wij een indicatie op maat op. Laat hieronder uw gegevens achter, dan ontvangt u de prijsindicatie.
      </p>
      <p className="text-[11px] text-gray-400 leading-relaxed mt-4 border-t border-gray-100 pt-3">{data.meta.disclaimer}</p>
    </div>
  );
}
