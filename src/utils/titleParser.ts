// Raw YouTube titles look like:
//   "Sunday Suspense | Feluda | London-e Feluda | Satyajit Ray | Mirchi Bangla"
// Every title repeats the same channel/show noise — this pulls out just the
// story name, the series, the author, and (if present) the Bengali title.

const BENGALI_RE = /[ঀ-৿]/;

const NOISE_RE = /^(sunday suspense|goppo ?mirer ?thek|mirchi( bangla)?( audio stor(y|ies))?( ?98\.3)?|audio story)$/i;

const KNOWN_SERIES = ["feluda", "byomkesh", "taranath tantrik", "professor shonku", "tantrik", "horror", "thriller"];

const KNOWN_AUTHORS = [
  "satyajit ray",
  "sharadindu bandyopadhyay",
  "saradindu bandyopadhyay",
  "bibhutibhushan bandyopadhyay",
  "sunil gangopadhyay",
  "arthur conan doyle",
  "rabindranath tagore",
  "bankim chandra chattopadhyay",
  "ruskin bond",
  "tarapada roy",
  "tarapada ray",
  "shirshendu mukhopadhyay",
  "leela majumdar",
  "anish deb",
  "bram stoker",
  "jules verne",
  "charles dickens",
  "hemendra kumar roy",
  "samaresh majumdar",
];

const isCreditOrPromo = (segment: string) => {
  const lower = segment.toLowerCase();
  return (
    lower.startsWith("#") ||
    /\b(ep(isode)?\.?\s*\d+|full story|official audio)\b/i.test(segment) ||
    // Goppo titles often put a comma-separated cast after the story name.
    (lower.includes("mir") && segment.includes(","))
  );
};

export interface ParsedTitle {
  titleEn: string;
  titleBn?: string;
  series?: string;
  author?: string;
}

export function parseEpisodeTitle(raw: string): ParsedTitle {
  const segments = raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  let series: string | undefined;
  let author: string | undefined;
  let titleBn: string | undefined;
  const candidates: string[] = [];

  for (const seg of segments) {
    if (NOISE_RE.test(seg)) continue;
    if (isCreditOrPromo(seg)) continue;
    if (BENGALI_RE.test(seg)) {
      titleBn = seg;
      continue;
    }
    const lower = seg.toLowerCase();
    if (!series && KNOWN_SERIES.includes(lower)) {
      series = seg;
      continue;
    }
    if (!author && KNOWN_AUTHORS.includes(lower)) {
      author = seg;
      continue;
    }
    candidates.push(seg);
  }

  // Both official channels lead with the story name; later segments are
  // usually cast, credits, or campaign labels.
  const titleEn = candidates[0] ?? raw;

  return { titleEn, titleBn, series, author };
}

export function episodeSecondaryLabel(series?: string, author?: string): string {
  return [series, author].filter(Boolean).join(" · ").toUpperCase();
}
