import sundayDefault from "./assets/kolkata-midnight.png";
import gmtDefault from "./assets/gmt-default.png";
import feludaArtwork from "./assets/feluda.png";
import horrorArtwork from "./assets/horror.png";
import detectiveArtwork from "./assets/detective.png";
import adventureArtwork from "./assets/adventure.png";
import writersArtwork from "./assets/writers-room.png";
import byomkeshArtwork from "./assets/byomkesh.png";
import shonkuArtwork from "./assets/shonku.png";
import taranathArtwork from "./assets/taranath.png";
import kakababuArtwork from "./assets/kakababu.png";
import sherlockArtwork from "./assets/sherlock.png";

export type ChannelId = "sunday-suspense" | "goppo-mirer-thek";
export type CollectionKind = "character" | "writer" | "genre" | "original";

export interface StoryCollection {
  id: string;
  label: string;
  bengaliLabel?: string;
  entityLabel?: string;
  sourceWriter?: string;
  kind: CollectionKind;
  playlistId: string;
  videoCount: number;
  artwork: string;
}

export interface StoryChannel {
  id: ChannelId;
  shortLabel: string;
  titleLead: string;
  titleMain: string;
  bengaliTitle: string;
  tagline: string;
  kicker: string;
  frequency: string;
  accent: string;
  defaultArtwork: string;
  defaultCollectionId: string;
  collections: StoryCollection[];
}

export const CHANNELS: StoryChannel[] = [
  {
    id: "sunday-suspense",
    shortLabel: "Sunday Suspense",
    titleLead: "Sunday",
    titleMain: "Suspense",
    bengaliTitle: "সানডে সাসপেন্স",
    tagline: "রহস্য, রোমাঞ্চ আর অলৌকিক গল্পের রাত",
    kicker: "An archive of voices after dark",
    frequency: "98.3 FM",
    accent: "#e7a74c",
    defaultArtwork: sundayDefault,
    defaultCollectionId: "ss-feluda",
    collections: [
      { id: "ss-feluda", label: "Feluda", bengaliLabel: "ফেলুদা", sourceWriter: "Satyajit Ray", kind: "character", playlistId: "PLq71IJk8mCV7wu6haZBFgoCauLDYPyMZX", videoCount: 22, artwork: feludaArtwork },
      { id: "ss-byomkesh", label: "Byomkesh Bakshi", bengaliLabel: "ব্যোমকেশ বক্সী", sourceWriter: "Saradindu Bandyopadhyay", kind: "character", playlistId: "PLq71IJk8mCV5z1vvLnRcQSLKJnAuwmohf", videoCount: 24, artwork: byomkeshArtwork },
      { id: "ss-shonku", label: "Professor Shonku", bengaliLabel: "প্রফেসর শঙ্কু", sourceWriter: "Satyajit Ray", kind: "character", playlistId: "PLq71IJk8mCV4Ga5SrVefTodmDZ5qkDIOc", videoCount: 40, artwork: shonkuArtwork },
      { id: "ss-taranath", label: "Taranath Tantrik", bengaliLabel: "তারানাথ তান্ত্রিক", sourceWriter: "Bibhutibhushan Bandyopadhyay", kind: "character", playlistId: "PLq71IJk8mCV5dHmSHIb9h9JsiE9TRFuyS", videoCount: 21, artwork: taranathArtwork },
      { id: "ss-kakababu", label: "Kakababu", bengaliLabel: "কাকাবাবু", sourceWriter: "Sunil Gangopadhyay", kind: "character", playlistId: "PLq71IJk8mCV4_vvuAFwhNqVNBYPBqcKoi", videoCount: 7, artwork: kakababuArtwork },
      { id: "ss-sherlock", label: "Sherlock Holmes", bengaliLabel: "শার্লক হোমস", sourceWriter: "Arthur Conan Doyle", kind: "character", playlistId: "PLq71IJk8mCV4QdfUSV2KYMRZoLeZnIxHp", videoCount: 31, artwork: sherlockArtwork },

      { id: "ss-tagore-bou", entityLabel: "Rabindranath Tagore", label: "Bou Thakuranir Haat", bengaliLabel: "বউ ঠাকুরানীর হাট", kind: "writer", playlistId: "PLq71IJk8mCV5di3ccQPPsp2qV_r7lhN3M", videoCount: 6, artwork: writersArtwork },
      { id: "ss-tagore-noukadubi", entityLabel: "Rabindranath Tagore", label: "Noukadoobi", bengaliLabel: "নৌকাডুবি", kind: "writer", playlistId: "PLq71IJk8mCV6TAJVpYVR9vI3qoUR3Wguh", videoCount: 6, artwork: writersArtwork },
      { id: "ss-bankim-will", entityLabel: "Bankim Chandra Chattopadhyay", label: "Krishnakanter Will", bengaliLabel: "কৃষ্ণকান্তের উইল", kind: "writer", playlistId: "PLq71IJk8mCV64uBqzvc4amhSEzREflanm", videoCount: 5, artwork: writersArtwork },
      { id: "ss-bankim-bishbrikkho", entityLabel: "Bankim Chandra Chattopadhyay", label: "Bishbrikkho", bengaliLabel: "বিষবৃক্ষ", kind: "writer", playlistId: "PLq71IJk8mCV4c6yRheFI6_2PXTsetmDG4", videoCount: 7, artwork: writersArtwork },
      { id: "ss-tarapada-comedy", entityLabel: "Tarapada Ray", label: "Comedy Stories", bengaliLabel: "হাসির গল্প", kind: "writer", playlistId: "PLq71IJk8mCV4KIbEtQuOreVnkw8lTAUfN", videoCount: 4, artwork: writersArtwork },
      { id: "ss-tarapada-special", entityLabel: "Tarapada Ray", label: "Best of Bengali Comedy", bengaliLabel: "তারাপদ রায় স্পেশাল", kind: "writer", playlistId: "PLq71IJk8mCV6-cRQuRjHw32083YN7N4AI", videoCount: 5, artwork: writersArtwork },
      { id: "ss-dickens", label: "Charles Dickens", entityLabel: "International classics", kind: "writer", playlistId: "PLq71IJk8mCV5_LRTSUzXwkJRV3GDc-NS5", videoCount: 4, artwork: writersArtwork },

      { id: "ss-horror", label: "Horror & Black Magic", bengaliLabel: "ভূত, ভয় ও তন্ত্র", kind: "genre", playlistId: "PLq71IJk8mCV5QIERhRQ2n2bJ8EbsYmL_Y", videoCount: 26, artwork: horrorArtwork },
      { id: "ss-haar-heem", label: "Haar Heem Horror", bengaliLabel: "হার হিম হরর", kind: "genre", playlistId: "PLq71IJk8mCV5PPlPiLgKsyguhqXy3I4fw", videoCount: 47, artwork: horrorArtwork },
      { id: "ss-bhoot-shabdhan", label: "Bhoot Hoite Shabdhan", bengaliLabel: "ভূত হইতে সাবধান", kind: "genre", playlistId: "PLq71IJk8mCV6DWEtyeLMFyaevVDCP-IeT", videoCount: 15, artwork: horrorArtwork },
      { id: "ss-romantic", label: "Romantic Web Series", bengaliLabel: "প্রেমের গল্প", kind: "genre", playlistId: "PLq71IJk8mCV5nHKRVI64BOx63mpNXfRiQ", videoCount: 21, artwork: gmtDefault },
      { id: "ss-prem-dot-com", label: "Prem Dot Com", bengaliLabel: "প্রেম ডট কম", kind: "genre", playlistId: "PLq71IJk8mCV5QZ3AWwyekaVyiwounxMAu", videoCount: 10, artwork: gmtDefault },
      { id: "ss-freedom", label: "Freedom Struggle Stories", bengaliLabel: "স্বাধীনতার গল্প", kind: "genre", playlistId: "PLXvVTmxcl8_g", videoCount: 12, artwork: adventureArtwork },
      { id: "ss-rajkahini", label: "Rajkahini", bengaliLabel: "রাজকাহিনী", kind: "genre", playlistId: "PLq71IJk8mCV4RZbUVjav38ua3C3ElBWH8", videoCount: 9, artwork: adventureArtwork },
      { id: "ss-gen-z", label: "Gen Z", bengaliLabel: "প্রেম, স্বপ্ন ও অভিযান", kind: "genre", playlistId: "PLDPWVmO6gJ9w", videoCount: 18, artwork: gmtDefault },
      { id: "ss-friendship", label: "Friendship Stories", bengaliLabel: "বন্ধুত্বের গল্প", kind: "genre", playlistId: "PLq71IJk8mCV6ysTa3dd4_5WAq4Eh3lHzB", videoCount: 41, artwork: gmtDefault },

      { id: "ss-shorojontro", label: "Shorojontro", bengaliLabel: "ষড়যন্ত্র", kind: "original", playlistId: "PLq71IJk8mCV7cZ20xHqZjPUuE_shLIW-w", videoCount: 15, artwork: detectiveArtwork },
      { id: "ss-mukhosher-arale", label: "Mukhosher Arale", bengaliLabel: "মুখোশের আড়ালে", kind: "original", playlistId: "PLq71IJk8mCV6d35meVavC-SGn78iPTIXv", videoCount: 16, artwork: detectiveArtwork },
      { id: "ss-golpo-mancho", label: "Golpo Mancho", bengaliLabel: "গল্প মঞ্চ", kind: "original", playlistId: "PLJQetppaN_vU", videoCount: 9, artwork: writersArtwork },
      { id: "ss-bollei-hoy", label: "Bollei Hoy Nahole Noy", bengaliLabel: "বললেই হয় নাহলে নয়", kind: "original", playlistId: "PLaUcP1ITx5e0", videoCount: 13, artwork: writersArtwork },
    ],
  },
  {
    id: "goppo-mirer-thek",
    shortLabel: "Goppo Mir-er Thek",
    titleLead: "Goppo",
    titleMain: "Mir-er Thek",
    bengaliTitle: "গপ্পো মীরের ঠেক",
    tagline: "আড্ডা জমুক গল্পের সঙ্গে",
    kicker: "Stories served from the storyteller's chair",
    frequency: "THEK 01",
    accent: "#dc8a46",
    defaultArtwork: gmtDefault,
    defaultCollectionId: "gmt-detective",
    collections: [
      { id: "gmt-detective", label: "Detective Stories", bengaliLabel: "গোয়েন্দা গল্প", kind: "genre", playlistId: "PLfKXf4CdTy2h74jZkMJBi6fdkk7bz-hVo", videoCount: 24, artwork: detectiveArtwork },
      { id: "gmt-horror", label: "Horror Stories", bengaliLabel: "ভয়ের গল্প", kind: "genre", playlistId: "PLfKXf4CdTy2jsWap6kJFFtukhPpl4RsFf", videoCount: 38, artwork: horrorArtwork },
      { id: "gmt-adventure", label: "Adventure Stories", bengaliLabel: "অ্যাডভেঞ্চার", kind: "genre", playlistId: "PLfKXf4CdTy2iKaFwLniKOYSMcCzIlpCiK", videoCount: 18, artwork: adventureArtwork },
      { id: "gmt-historical", label: "Historical Stories", bengaliLabel: "ঐতিহাসিক গল্প", kind: "genre", playlistId: "PLfKXf4CdTy2gPKQBs6fPZJMzSxNJORhqh", videoCount: 9, artwork: adventureArtwork },
      { id: "gmt-comedy", label: "Comedy Stories", bengaliLabel: "হাসির গল্প", kind: "genre", playlistId: "PLfKXf4CdTy2iXBRfKPr_E0Zn_wYxlq8-0", videoCount: 8, artwork: gmtDefault },
      { id: "gmt-love", label: "Love Stories", bengaliLabel: "প্রেমের গল্প", kind: "genre", playlistId: "PLfKXf4CdTy2iTrWsCUfdh1_JATCDPKixA", videoCount: 6, artwork: gmtDefault },
      { id: "gmt-kaushik", label: "Kaushik Majumdar", bengaliLabel: "কৌশিক মজুমদার", entityLabel: "Contemporary writers", kind: "writer", playlistId: "PLfKXf4CdTy2gVWiCcLnz7Tr6gtN0uyx7u", videoCount: 10, artwork: writersArtwork },
      { id: "gmt-abhik", label: "Abhik Arjun Dutta", bengaliLabel: "অভীক অর্জুন দত্ত", entityLabel: "Contemporary writers", kind: "writer", playlistId: "PLfKXf4CdTy2iIi36_Rf5t-zRq0f9LWbhz", videoCount: 7, artwork: writersArtwork },
      { id: "gmt-prabhat", label: "Prabhat Kumar Mukhopadhyay", bengaliLabel: "প্রভাতকুমার মুখোপাধ্যায়", kind: "writer", playlistId: "PLfKXf4CdTy2hN-VTuujn_oRRsuQ9PNcwG", videoCount: 4, artwork: writersArtwork },
      { id: "gmt-anish-deb", label: "Anish Deb", bengaliLabel: "অনীশ দেব", kind: "writer", playlistId: "PLfKXf4CdTy2gx-PHbNiIgAw6DQA4CQX4f", videoCount: 4, artwork: writersArtwork },
      { id: "gmt-shirshendu", label: "Shirshendu Mukhopadhyay", bengaliLabel: "শীর্ষেন্দু মুখোপাধ্যায়", kind: "writer", playlistId: "PLfKXf4CdTy2iMfuuFl_pC4gGzltp3EC6L", videoCount: 2, artwork: writersArtwork },
      { id: "gmt-shorts", label: "GMT Shorts", bengaliLabel: "ছোট গল্প", kind: "original", playlistId: "PLfKXf4CdTy2iI8iHYWGW7L3WBKbbI0hJk", videoCount: 25, artwork: gmtDefault },
      { id: "gmt-onstage", label: "GMT Onstage", bengaliLabel: "মঞ্চে গল্প", kind: "original", playlistId: "PLfKXf4CdTy2g__vnyAGoHNdAD1GyxWC4N", videoCount: 12, artwork: gmtDefault },
      { id: "gmt-originals", label: "GMT Originals", bengaliLabel: "মীরের নিজস্ব গল্প", kind: "original", playlistId: "PLfKXf4CdTy2hiBD3_pungQDfLHlXFR3V5", videoCount: 13, artwork: gmtDefault },
    ],
  },
];

export function getChannel(id: ChannelId) {
  return CHANNELS.find((channel) => channel.id === id) ?? CHANNELS[0];
}

export function getCollection(channel: StoryChannel, id: string) {
  return channel.collections.find((collection) => collection.id === id) ?? channel.collections[0];
}
