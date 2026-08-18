// Official YouTube titles mix the story name with programme labels, character
// names, writers, cast and promotional copy. The collection context lets us
// remove those known labels before choosing a title.

const BENGALI_RE = /[ঀ-৿]/;
const PROGRAMME_RE = /\b(?:sunday\s+suspense|goppo\s+mir(?:\s*-\s*|\s*)er\s+thek)\b/i;
const PROGRAMME_BENGALI = ["সানডে সাসপেন্স", "গপ্পো মীরের ঠেক", "গল্প মীরের ঠেক"];
const FORMAT_RE = /^(?:classics?|full(?:\s+story|\s+episode)?|special|audio\s+stor(?:y|ies)|bengali\s+audio\s+stor(?:y|ies)|official\s+audio|radio\s+drama|episode\s*\d+|part\s*\d+)$/i;
const PROMO_RE = /^(?:best\s+of|playlist|new\s+episode|latest\s+episode|mirchi\s+bangla(?:\s+audio\s+stor(?:y|ies))?|mirchi\s*98\.3|radio\s+mirchi|mir\s+afsar\s+ali)$/i;

const KNOWN_SERIES = [
  "feluda",
  "byomkesh",
  "byomkesh bakshi",
  "taranath tantrik",
  "professor shonku",
  "shonku",
  "kakababu",
  "kiriti",
  "kiriti roy",
  "tenida",
  "eken babu",
  "sherlock holmes",
  "tantrik",
];

const KNOWN_AUTHORS = [
  "satyajit ray",
  "nihar ranjan gupta",
  "narayan gangopadhyay",
  "sujan dasgupta",
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

const comparable = (value: string) => value
  .normalize("NFKC")
  .toLocaleLowerCase()
  .replace(/[’'`]/g, "")
  .replace(/[^a-z0-9ঀ-৿]+/g, " ")
  .trim();

const looselyMatches = (segment: string, known?: string) => {
  if (!known) return false;
  const left = comparable(segment);
  const right = comparable(known);
  if (!left || !right) return false;
  return left === right || (Math.min(left.length, right.length) >= 4 && (left.includes(right) || right.includes(left)));
};

const stripProgrammePrefix = (segment: string) => segment.replace(
  /^(?:sunday\s+suspense|goppo\s+mir(?:\s*-\s*|\s*)er\s+thek)(?:\s+(?:classics?|full\s+episode|full\s+story|special|audio\s+story))*\s*(?:[:–—-]\s*)?/i,
  "",
).trim();

const isCreditOrPromo = (segment: string) => {
  const lower = segment.toLocaleLowerCase();
  return (
    lower.startsWith("#") ||
    /^(?:by|written\s+by|story\s+by|narrated\s+by|voice|voices|cast|featuring|ft\.?|presented\s+by|produced\s+by)\b/i.test(segment) ||
    /\b(?:official\s+audio|subscribe|radio\s+jockey|rj\s+\w+)\b/i.test(segment) ||
    (lower.includes("mir") && segment.includes(","))
  );
};

export interface TitleContext {
  channelLabel?: string;
  collectionLabel?: string;
  collectionBengaliLabel?: string;
  collectionKind?: "character" | "writer" | "genre" | "original";
  writer?: string;
  episodeNumber?: number;
}

export interface ParsedTitle {
  titleEn: string;
  titleBn?: string;
  titleIsFallback?: boolean;
  series?: string;
  author?: string;
}

export function parseEpisodeTitle(raw: string, context: TitleContext = {}): ParsedTitle {
  const segments = raw
    .split(/\s*(?:\||•)\s*/)
    .flatMap((segment) => {
      const stripped = stripProgrammePrefix(segment.trim());
      return (stripped || segment).split(/\s+[–—-]\s+/);
    })
    .map((segment) => segment.trim())
    .filter(Boolean);

  let series: string | undefined;
  let author: string | undefined;
  let titleBn: string | undefined;
  const candidates: Array<{ value: string; score: number }> = [];

  segments.forEach((original, index) => {
    const stripped = stripProgrammePrefix(original);
    if (!stripped && PROGRAMME_RE.test(original)) return;
    let segment = stripped || original;

    const trailingCredit = segment.match(/\s*\(([^)]+)\)\s*$/);
    if (trailingCredit) {
      const credit = trailingCredit[1];
      const isWriter = looselyMatches(credit, context.writer) || KNOWN_AUTHORS.some((label) => looselyMatches(credit, label));
      if (isWriter) {
        author ??= context.writer ?? credit;
        segment = segment.slice(0, trailingCredit.index).trim();
      }
    }

    const inlineCredit = segment.match(/^(.+?)\s+by\s+(.+)$/i);
    if (inlineCredit) {
      segment = inlineCredit[1].trim();
      author ??= inlineCredit[2].trim();
    }

    if (PROGRAMME_RE.test(segment) || FORMAT_RE.test(segment) || PROMO_RE.test(segment)) return;
    if (context.channelLabel && looselyMatches(segment, context.channelLabel)) return;
    if (isCreditOrPromo(segment)) return;

    if (BENGALI_RE.test(segment)) {
      segment = segment.replace(/\s*(?:episode|ep)\.?\s*\d+\s*$/i, "").trim();
      const isProgramme = PROGRAMME_BENGALI.some((label) => looselyMatches(segment, label));
      const isCollection = looselyMatches(segment, context.collectionBengaliLabel);
      if (!isProgramme && !isCollection && !titleBn) titleBn = segment;
      return;
    }

    const knownSeries = KNOWN_SERIES.find((label) => comparable(segment) === comparable(label));
    const isContextCollection = comparable(segment) === comparable(context.collectionLabel ?? "");
    if (knownSeries || (isContextCollection && context.collectionKind === "character")) {
      series ??= context.collectionLabel ?? segment;
      return;
    }

    const knownAuthor = KNOWN_AUTHORS.find((label) => looselyMatches(segment, label));
    if (knownAuthor || looselyMatches(segment, context.writer)) {
      author ??= context.writer ?? segment;
      return;
    }

    segment = segment
      .replace(/#goppo\s*mirer\s*thek/ig, "")
      .replace(/\b(?:episode|ep)\.?\s*\d+\b/ig, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!segment) return;

    const words = comparable(segment).split(/\s+/).filter(Boolean).length;
    const genericPenalty = /\b(?:classics?|collection|playlist|episode|audio|story|stories)\b/i.test(segment) ? 8 : 0;
    const lengthBonus = segment.length >= 3 && segment.length <= 90 ? 4 : 0;
    const phraseBonus = words >= 1 && words <= 9 ? 3 : 0;
    candidates.push({ value: segment, score: 30 - index + lengthBonus + phraseBonus - genericPenalty });
  });

  const selectedTitle = candidates.sort((left, right) => right.score - left.score)[0]?.value;
  const titleEn = selectedTitle
    ?? `${context.collectionLabel ?? "Archive"} · Broadcast ${String(context.episodeNumber ?? 1).padStart(2, "0")}`;

  if (!series && context.collectionKind === "character") series = context.collectionLabel;
  author ??= context.writer;

  return { titleEn, titleBn, titleIsFallback: !selectedTitle || undefined, series, author };
}

export function episodeSecondaryLabel(series?: string, author?: string): string {
  return [series, author].filter(Boolean).join(" · ").toUpperCase();
}
