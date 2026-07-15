export interface Project {
  slug: string;
  title: string;
  location: string;
  /** Short line on the card */
  description: string;
  /** Longer intro on the detail page */
  intro: string;
  beforeImage?: string;
  afterImage?: string;
  /** Extra classes on the "after" image (e.g. a subtle scale for near-identical photos) */
  afterImageClassName?: string;
  beforeBg: string;
  afterBg: string;
  initialPosition: number;
  /** Bullet list shown on the detail page */
  details: string[];
}

export const projects: Project[] = [
  {
    slug: 'casco-nieuwbouwwoning-delft',
    title: 'Casco nieuwbouwwoning Delft',
    location: 'Delft',
    description: 'Compleet schilderwerk van een casco opgeleverde nieuwbouwwoning — binnen en buiten strak afgewerkt.',
    intro:
      'Deze nieuwbouwwoning in Delft werd casco opgeleverd. WIDOR verzorgde het complete schilderwerk — van het gronderen en afwerken van wanden en plafonds tot het lakken van kozijnen, deuren en trappen. Het resultaat is een strak, egaal en instapklaar interieur.',
    beforeImage: '/nieuwbouw-woning-voor.png',
    afterImage: '/nieuwbouw-woning-na.png',
    beforeBg: 'bg-amber-200',
    afterBg: 'bg-sky-200',
    initialPosition: 50,
    details: [
      'Wanden en plafonds gegrond en afgewerkt',
      'Kozijnen, deuren en trappen gelakt',
      'Strakke, egale eindafwerking',
      'Instapklaar opgeleverd',
    ],
  },
  {
    slug: 'buitenschilderwerkzaamheden-wassenaar',
    title: 'Buitenschilderwerkzaamheden Wassenaar',
    location: 'Wassenaar',
    description: 'Buitenschilderwerk van garagedeur en kozijnen. Strak afgewerkt en weer als nieuw.',
    intro:
      'In Wassenaar verzorgde WIDOR het buitenschilderwerk van deze woning. De verweerde garagedeur en kozijnen werden grondig voorbehandeld, geschuurd en opnieuw geschilderd in een diepe, egale kleur met een duurzame, weerbestendige afwerking.',
    beforeImage: '/garagedeur-voor.png',
    afterImage: '/garagedeur-na.png',
    afterImageClassName: 'scale-[1.06] origin-bottom-left',
    beforeBg: 'bg-stone-300',
    afterBg: 'bg-slate-200',
    initialPosition: 40,
    details: [
      'Garagedeur grondig voorbehandeld en geschuurd',
      'Kozijnen meegenomen in het schilderwerk',
      'Diepe, egale kleur met strakke afwerking',
      'Weerbestendig eindresultaat',
    ],
  },
  {
    slug: 'gevel-appartementencomplex-den-haag',
    title: 'Gevel appartementencomplex',
    location: 'Den Haag',
    description: 'Buitenschilderwerk van een volledig appartementencomplex in Den Haag.',
    intro:
      'Voor dit appartementencomplex in Den Haag verzorgde WIDOR het volledige buitenschilderwerk. Planmatig uitgevoerd met minimale overlast voor de bewoners, met hoogwaardige verfsystemen die de gevel jarenlang beschermen.',
    beforeBg: 'bg-orange-200',
    afterBg: 'bg-blue-100',
    initialPosition: 55,
    details: [
      'Volledig buitenschilderwerk van het complex',
      'Planmatig uitgevoerd, minimale overlast',
      'Hoogwaardige, weerbestendige verfsystemen',
      'Duurzame bescherming van de gevel',
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
