export interface Episode {
  id: string; // YouTube video id
  titleEn: string;
  titleBn?: string;
  series?: string;
  author?: string;
  duration?: string; // fallback display duration, "mm:ss" — overwritten once real duration is known
}
