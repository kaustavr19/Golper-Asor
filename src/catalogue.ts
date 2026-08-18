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
  writerId?: string;
  kind: CollectionKind;
  playlistId: string;
  videoCount: number;
  artwork: string;
}

export interface WriterProfile {
  id: string;
  label: string;
  bengaliLabel?: string;
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
  writers?: WriterProfile[];
}

const sundaySuspenseWriters: WriterProfile[] = [
  { id: "victor-hugo", label: "Victor Hugo", bengaliLabel: "ভিক্টর হুগো", artwork: writersArtwork },
  { id: "charles-dickens", label: "Charles Dickens", bengaliLabel: "চার্লস ডিকেন্স", artwork: writersArtwork },
  { id: "bankim", label: "Bankim Chandra Chattopadhyay", bengaliLabel: "বঙ্কিমচন্দ্র চট্টোপাধ্যায়", artwork: writersArtwork },
  { id: "rabindranath", label: "Rabindranath Tagore", bengaliLabel: "রবীন্দ্রনাথ ঠাকুর", artwork: writersArtwork },
  { id: "abanindranath", label: "Abanindranath Tagore", bengaliLabel: "অবনীন্দ্রনাথ ঠাকুর", artwork: adventureArtwork },
  { id: "tarapada", label: "Tarapada Ray", bengaliLabel: "তারাপদ রায়", artwork: writersArtwork },
  { id: "abhirup", label: "Abhirup Sarkar", bengaliLabel: "অভিরূপ সরকার", artwork: detectiveArtwork },
  { id: "saradindu", label: "Saradindu Bandyopadhyay", bengaliLabel: "শরদিন্দু বন্দ্যোপাধ্যায়", artwork: byomkeshArtwork },
  { id: "suchitra", label: "Suchitra Bhattacharya", bengaliLabel: "সুচিত্রা ভট্টাচার্য", artwork: writersArtwork },
  { id: "abhigyan", label: "Abhigyan Ganguly", bengaliLabel: "অভিজ্ঞান গঙ্গোপাধ্যায়", artwork: writersArtwork },
  { id: "debarati", label: "Debarati Mukhopadhyay", bengaliLabel: "দেবারতি মুখোপাধ্যায়", artwork: adventureArtwork },
  { id: "sarat-chandra", label: "Sarat Chandra Chattopadhyay", bengaliLabel: "শরৎচন্দ্র চট্টোপাধ্যায়", artwork: writersArtwork },
  { id: "alexandre-dumas", label: "Alexandre Dumas", bengaliLabel: "আলেকজান্ডার দ্যুমা", artwork: adventureArtwork },
  { id: "sunil", label: "Sunil Gangopadhyay", bengaliLabel: "সুনীল গঙ্গোপাধ্যায়", artwork: kakababuArtwork },
  { id: "shakespeare", label: "William Shakespeare", bengaliLabel: "উইলিয়াম শেক্সপিয়র", artwork: writersArtwork },
  { id: "premendra", label: "Premendra Mitra", bengaliLabel: "প্রেমেন্দ্র মিত্র", artwork: adventureArtwork },
  { id: "ullash", label: "Ullash Mallick", bengaliLabel: "উল্লাস মল্লিক", artwork: writersArtwork },
  { id: "agatha-christie", label: "Agatha Christie", bengaliLabel: "আগাথা ক্রিস্টি", artwork: detectiveArtwork },
  { id: "dipanwita", label: "Dipanwita Roy", bengaliLabel: "দীপান্বিতা রায়", artwork: detectiveArtwork },
  { id: "satyajit", label: "Satyajit Ray", bengaliLabel: "সত্যজিৎ রায়", artwork: feludaArtwork },
  { id: "smaranjit", label: "Smaranjit Chakraborty", bengaliLabel: "স্মরণজিৎ চক্রবর্তী", artwork: writersArtwork },
  { id: "subodh", label: "Subodh Ghosh", bengaliLabel: "সুবোধ ঘোষ", artwork: adventureArtwork },
  { id: "pracheta", label: "Pracheta Gupta", bengaliLabel: "প্রচেত গুপ্ত", artwork: writersArtwork },
  { id: "abhinandan", label: "Abhinandan Bandyopadhyay", bengaliLabel: "অভিনন্দন বন্দ্যোপাধ্যায়", artwork: writersArtwork },
  { id: "nihar-ranjan", label: "Nihar Ranjan Gupta", bengaliLabel: "নীহাররঞ্জন গুপ্ত", artwork: detectiveArtwork },
  { id: "ef-benson", label: "E. F. Benson", bengaliLabel: "ই. এফ. বেনসন", artwork: horrorArtwork },
  { id: "parashuram", label: "Parashuram (Rajshekhar Basu)", bengaliLabel: "পরশুরাম (রাজশেখর বসু)", artwork: writersArtwork },
  { id: "sukumar-ray", label: "Sukumar Ray", bengaliLabel: "সুকুমার রায়", artwork: writersArtwork },
  { id: "narayan", label: "Narayan Gangopadhyay", bengaliLabel: "নারায়ণ গঙ্গোপাধ্যায়", artwork: adventureArtwork },
  { id: "gajendra", label: "Gajendra Kumar Mitra", bengaliLabel: "গজেন্দ্রকুমার মিত্র", artwork: horrorArtwork },
  { id: "baisali", label: "Baisali Dasgupta Nandi", bengaliLabel: "বৈশালী দাশগুপ্ত নন্দী", artwork: horrorArtwork },
  { id: "harinarayan", label: "Harinarayan Chattopadhyay", bengaliLabel: "হরিনারায়ণ চট্টোপাধ্যায়", artwork: horrorArtwork },
  { id: "anish-deb", label: "Anish Deb", bengaliLabel: "অনীশ দেব", artwork: horrorArtwork },
  { id: "himadri-kishore", label: "Himadri Kishore Dasgupta", bengaliLabel: "হিমাদ্রিকিশোর দাশগুপ্ত", artwork: horrorArtwork },
  { id: "leela-majumdar", label: "Leela Majumdar", bengaliLabel: "লীলা মজুমদার", artwork: writersArtwork },
  { id: "bibhutibhushan", label: "Bibhutibhushan Bandyopadhyay", bengaliLabel: "বিভূতিভূষণ বন্দ্যোপাধ্যায়", artwork: taranathArtwork },
  { id: "hemendra-kumar-roy", label: "Hemendra Kumar Roy", bengaliLabel: "হেমেন্দ্রকুমার রায়", artwork: adventureArtwork },
  { id: "manoj-sen", label: "Manoj Sen", bengaliLabel: "মনোজ সেন", artwork: horrorArtwork },
  { id: "shirshendu", label: "Shirshendu Mukhopadhyay", bengaliLabel: "শীর্ষেন্দু মুখোপাধ্যায়", artwork: writersArtwork },
];

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
    writers: sundaySuspenseWriters,
    collections: [
      { id: "ss-feluda", label: "Feluda", bengaliLabel: "ফেলুদা", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "character", playlistId: "PLq71IJk8mCV7wu6haZBFgoCauLDYPyMZX", videoCount: 22, artwork: feludaArtwork },
      { id: "ss-byomkesh", label: "Byomkesh Bakshi", bengaliLabel: "ব্যোমকেশ বক্সী", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "character", playlistId: "PLq71IJk8mCV5z1vvLnRcQSLKJnAuwmohf", videoCount: 24, artwork: byomkeshArtwork },
      { id: "ss-shonku", label: "Professor Shonku", bengaliLabel: "প্রফেসর শঙ্কু", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "character", playlistId: "PLq71IJk8mCV4Ga5SrVefTodmDZ5qkDIOc", videoCount: 40, artwork: shonkuArtwork },
      { id: "ss-taranath", label: "Taranath Tantrik", bengaliLabel: "তারানাথ তান্ত্রিক", sourceWriter: "Bibhutibhushan Bandyopadhyay", writerId: "bibhutibhushan", kind: "character", playlistId: "PLq71IJk8mCV5dHmSHIb9h9JsiE9TRFuyS", videoCount: 21, artwork: taranathArtwork },
      { id: "ss-kakababu", label: "Kakababu", bengaliLabel: "কাকাবাবু", sourceWriter: "Sunil Gangopadhyay", writerId: "sunil", kind: "character", playlistId: "PLq71IJk8mCV4_vvuAFwhNqVNBYPBqcKoi", videoCount: 7, artwork: kakababuArtwork },
      { id: "ss-kiriti", label: "Kiriti Roy & Horror", bengaliLabel: "কিরীটী রায় ও ভয়ের গল্প", sourceWriter: "Nihar Ranjan Gupta", writerId: "nihar-ranjan", kind: "character", playlistId: "PLq71IJk8mCV7Y70VeqcJN4bplhJhRoIy1", videoCount: 8, artwork: detectiveArtwork },
      { id: "ss-tenida", label: "Tenida", bengaliLabel: "টেনিদা", sourceWriter: "Narayan Gangopadhyay", writerId: "narayan", kind: "character", playlistId: "PLq71IJk8mCV4Z8MvMqcjCvNwx-5DB9sRJ", videoCount: 8, artwork: adventureArtwork },
      { id: "ss-eken", label: "Eken Babu", bengaliLabel: "একেনবাবু", sourceWriter: "Sujan Dasgupta", kind: "character", playlistId: "PLq71IJk8mCV6j59qmuk93Se_W7k9bfAcu", videoCount: 2, artwork: detectiveArtwork },
      { id: "ss-sherlock", label: "Sherlock Holmes", bengaliLabel: "শার্লক হোমস", sourceWriter: "Arthur Conan Doyle", kind: "character", playlistId: "PLq71IJk8mCV4QdfUSV2KYMRZoLeZnIxHp", videoCount: 31, artwork: sherlockArtwork },

      { id: "ss-victor-hugo", label: "Friday Classics", bengaliLabel: "ভিক্টর হুগো ক্লাসিকস", sourceWriter: "Victor Hugo", writerId: "victor-hugo", kind: "writer", playlistId: "PLFWOZidCSRv8", videoCount: 0, artwork: writersArtwork },
      { id: "ss-dickens", label: "Charles Dickens Classics", bengaliLabel: "চার্লস ডিকেন্স ক্লাসিকস", sourceWriter: "Charles Dickens", writerId: "charles-dickens", kind: "writer", playlistId: "PLq71IJk8mCV5_LRTSUzXwkJRV3GDc-NS5", videoCount: 4, artwork: writersArtwork },
      { id: "ss-bankim-will", label: "Krishnakanter Will", bengaliLabel: "কৃষ্ণকান্তের উইল", sourceWriter: "Bankim Chandra Chattopadhyay", writerId: "bankim", kind: "writer", playlistId: "PLq71IJk8mCV64uBqzvc4amhSEzREflanm", videoCount: 5, artwork: writersArtwork },
      { id: "ss-bankim-bishbrikkho", label: "Bishbrikkho", bengaliLabel: "বিষবৃক্ষ", sourceWriter: "Bankim Chandra Chattopadhyay", writerId: "bankim", kind: "writer", playlistId: "PLq71IJk8mCV4c6yRheFI6_2PXTsetmDG4", videoCount: 7, artwork: writersArtwork },
      { id: "ss-bankim-classics", label: "Bankim Classics", bengaliLabel: "বঙ্কিমচন্দ্র ক্লাসিকস", sourceWriter: "Bankim Chandra Chattopadhyay", writerId: "bankim", kind: "writer", playlistId: "PLq71IJk8mCV5LzijmEttIWkA2ut8Wk_ep", videoCount: 0, artwork: writersArtwork },
      { id: "ss-tagore-bou", label: "Bou Thakuranir Haat", bengaliLabel: "বউ ঠাকুরানীর হাট", sourceWriter: "Rabindranath Tagore", writerId: "rabindranath", kind: "writer", playlistId: "PLq71IJk8mCV5di3ccQPPsp2qV_r7lhN3M", videoCount: 6, artwork: writersArtwork },
      { id: "ss-tagore-noukadubi", label: "Noukadoobi", bengaliLabel: "নৌকাডুবি", sourceWriter: "Rabindranath Tagore", writerId: "rabindranath", kind: "writer", playlistId: "PLq71IJk8mCV6TAJVpYVR9vI3qoUR3Wguh", videoCount: 6, artwork: writersArtwork },
      { id: "ss-tarapada-comedy", label: "Comedy Stories", bengaliLabel: "মাতাল সমগ্র এবং অন্যান্য", sourceWriter: "Tarapada Ray", writerId: "tarapada", kind: "writer", playlistId: "PLq71IJk8mCV4KIbEtQuOreVnkw8lTAUfN", videoCount: 4, artwork: writersArtwork },
      { id: "ss-tarapada-special", label: "Best of Bengali Comedy", bengaliLabel: "তারাপদ রায় স্পেশাল", sourceWriter: "Tarapada Ray", writerId: "tarapada", kind: "writer", playlistId: "PLq71IJk8mCV6-cRQuRjHw32083YN7N4AI", videoCount: 5, artwork: writersArtwork },
      { id: "ss-abhirup-aditya", label: "Aditya Majumdar Detective Series", bengaliLabel: "আদিত্য মজুমদার", sourceWriter: "Abhirup Sarkar", writerId: "abhirup", kind: "writer", playlistId: "PLq71IJk8mCV65j1TBdI9V5WygKqCPZIza", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-saradindu-chhayapothik", label: "Chhayapothik", bengaliLabel: "ছায়াপথিক", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV5zVl4HhoX6sqYO5CRYlTNM", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-bijaylakshmi", label: "Bijaylakshmi", bengaliLabel: "বিজয়লক্ষ্মী", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV76lJ06c8bd5MYxJmXWRHKV", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-path", label: "Path Bendhe Dilo", bengaliLabel: "পথ বেঁধে দিল", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV6OyU4jFybwRFLVWOXXEr7D", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-rimjhim", label: "Rimjhim", bengaliLabel: "রিমঝিম", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV7lDDu-42WVfB0nc3rqUdEL", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-bisher-dhnowa", label: "Bisher Dhnowa", bengaliLabel: "বিষের ধোঁয়া", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV43nFq_D6WyEfZ4vqpl5gNP", videoCount: 0, artwork: writersArtwork },
      { id: "ss-suchitra-special", label: "Selected Stories", bengaliLabel: "সুচিত্রা ভট্টাচার্য স্পেশাল", sourceWriter: "Suchitra Bhattacharya", writerId: "suchitra", kind: "writer", playlistId: "PLq71IJk8mCV4Cxr8Kie8_g-ORkzKZyg9N", videoCount: 0, artwork: writersArtwork },
      { id: "ss-suchitra-kachher-manush", label: "Kachher Manush", bengaliLabel: "কাছের মানুষ", sourceWriter: "Suchitra Bhattacharya", writerId: "suchitra", kind: "writer", playlistId: "PLq71IJk8mCV4brlj7-d8aZq_cwDWyTESX", videoCount: 0, artwork: writersArtwork },
      { id: "ss-suchitra-kaacher-dewal", label: "Kaacher Dewal", bengaliLabel: "কাচের দেওয়াল", sourceWriter: "Suchitra Bhattacharya", writerId: "suchitra", kind: "writer", playlistId: "PLq71IJk8mCV7BrUT389uJbSzNou_0xLIl", videoCount: 0, artwork: writersArtwork },
      { id: "ss-abhigyan", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Abhigyan Ganguly", writerId: "abhigyan", kind: "writer", playlistId: "PLq71IJk8mCV4DHBGNO4rjuL4_nGqoyrwx", videoCount: 0, artwork: writersArtwork },
      { id: "ss-debarati-ullashkar", label: "Ullashkar", bengaliLabel: "উল্লাসকর", sourceWriter: "Debarati Mukhopadhyay", writerId: "debarati", kind: "writer", playlistId: "PLq71IJk8mCV7Ti5hzIg9OXzKEVtZpgBgj", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-sarat-chandranath", label: "Chandranath", bengaliLabel: "চন্দ্রনাথ", sourceWriter: "Sarat Chandra Chattopadhyay", writerId: "sarat-chandra", kind: "writer", playlistId: "PLq71IJk8mCV7wun-2SAUWt8mLlkNofqwU", videoCount: 0, artwork: writersArtwork },
      { id: "ss-sarat-srikanto", label: "Srikanto", bengaliLabel: "শ্রীকান্ত", sourceWriter: "Sarat Chandra Chattopadhyay", writerId: "sarat-chandra", kind: "writer", playlistId: "PLq71IJk8mCV4Az6JHmVvzEL4zj7ep4M1q", videoCount: 0, artwork: writersArtwork },
      { id: "ss-sarat-datta", label: "Datta", bengaliLabel: "দত্তা", sourceWriter: "Sarat Chandra Chattopadhyay", writerId: "sarat-chandra", kind: "writer", playlistId: "PLq71IJk8mCV6JucNL9XjyRBCU6OkpQ16h", videoCount: 0, artwork: writersArtwork },
      { id: "ss-sarat-classics", label: "Sarat Chandra Classics", bengaliLabel: "শরৎচন্দ্র ক্লাসিকস", sourceWriter: "Sarat Chandra Chattopadhyay", writerId: "sarat-chandra", kind: "writer", playlistId: "PLq71IJk8mCV6Lb6wZpYGRXnNZexRhJHko", videoCount: 0, artwork: writersArtwork },
      { id: "ss-dumas-monte-cristo", label: "The Count of Monte Cristo", bengaliLabel: "দ্য কাউন্ট অফ মন্টে ক্রিস্টো", sourceWriter: "Alexandre Dumas", writerId: "alexandre-dumas", kind: "writer", playlistId: "PLq71IJk8mCV4K_AOhMVn8WV27e7vh1CwL", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-sunil-arjun", label: "Arjun", bengaliLabel: "অর্জুন", sourceWriter: "Sunil Gangopadhyay", writerId: "sunil", kind: "writer", playlistId: "PLq71IJk8mCV4zSMI4C4029ArJCVFtllSd", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-sunil-aranyer-dinratri", label: "Aranyer Dinratri", bengaliLabel: "অরণ্যের দিনরাত্রি", sourceWriter: "Sunil Gangopadhyay", writerId: "sunil", kind: "writer", playlistId: "PLq71IJk8mCV5ykK84ZxjBRG_5e-B2DQ5u", videoCount: 0, artwork: writersArtwork },
      { id: "ss-shakespeare", label: "Shakespeare Classics", bengaliLabel: "শেক্সপিয়র ক্লাসিকস", sourceWriter: "William Shakespeare", writerId: "shakespeare", kind: "writer", playlistId: "PLq71IJk8mCV7BNyfSVeKAHTNkewM3vw24", videoCount: 0, artwork: writersArtwork },
      { id: "ss-premendra", label: "Selected Stories", bengaliLabel: "প্রেমেন্দ্র মিত্রের গল্প", sourceWriter: "Premendra Mitra", writerId: "premendra", kind: "writer", playlistId: "PLq71IJk8mCV6ej7I6ukjV_6gpC7md8HlH", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-ullash", label: "Comedy & Other Stories", bengaliLabel: "হাসি ও অন্যান্য গল্প", sourceWriter: "Ullash Mallick", writerId: "ullash", kind: "writer", playlistId: "PLq71IJk8mCV5zKYOtVi7H4Oe0K-wUus0y", videoCount: 0, artwork: writersArtwork },
      { id: "ss-agatha-murder-announced", label: "A Murder Is Announced", bengaliLabel: "আ মার্ডার ইজ অ্যানাউন্সড", sourceWriter: "Agatha Christie", writerId: "agatha-christie", kind: "writer", playlistId: "PLq71IJk8mCV4Ea75KA7LGqotmArmkvWjq", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-agatha-detectives", label: "Poirot & Miss Marple", bengaliLabel: "পোয়ারো ও মিস মার্পল", sourceWriter: "Agatha Christie", writerId: "agatha-christie", kind: "writer", playlistId: "PLq71IJk8mCV6H8ju_QePvQk82Oea0sUpz", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-dipanwita-diganta", label: "Diganta Deb Detective Series", bengaliLabel: "দিগন্ত দেব", sourceWriter: "Dipanwita Roy", writerId: "dipanwita", kind: "writer", playlistId: "PLq71IJk8mCV7PGQGtgsZsPasa_cmgVqW7", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-satyajit-golpo-101", label: "Golpo 101", bengaliLabel: "গল্প ১০১", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "writer", playlistId: "PLq71IJk8mCV6pnODuAYAn__XmjOSseZYz", videoCount: 0, artwork: feludaArtwork },
      { id: "ss-smaranjit-compass", label: "Compass", bengaliLabel: "কম্পাস", sourceWriter: "Smaranjit Chakraborty", writerId: "smaranjit", kind: "writer", playlistId: "PLq71IJk8mCV5rKtWBJEt2-4CSTMXrC0jY", videoCount: 0, artwork: writersArtwork },
      { id: "ss-smaranjit-patajhora", label: "Patajhorar Morshume", bengaliLabel: "পাতাঝরার মরশুমে", sourceWriter: "Smaranjit Chakraborty", writerId: "smaranjit", kind: "writer", playlistId: "PLq71IJk8mCV46pb9MsMy64l9LpPYx28WY", videoCount: 0, artwork: writersArtwork },
      { id: "ss-subodh-bharat-prem", label: "Bharat Prem Katha", bengaliLabel: "ভারত প্রেমকথা", sourceWriter: "Subodh Ghosh", writerId: "subodh", kind: "writer", playlistId: "PLq71IJk8mCV4Wq9xc8_GGbUm50TO4xc5C", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-pracheta", label: "Friday Classics", bengaliLabel: "প্রচেত গুপ্তের গল্প", sourceWriter: "Pracheta Gupta", writerId: "pracheta", kind: "writer", playlistId: "PLq71IJk8mCV4z1Nrsn0y0KNdv1JZMeAbx", videoCount: 0, artwork: writersArtwork },
      { id: "ss-abhinandan", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Abhinandan Bandyopadhyay", writerId: "abhinandan", kind: "writer", playlistId: "PLq71IJk8mCV4TsMk608X8ZLmnFwgHmttW", videoCount: 0, artwork: writersArtwork },
      { id: "ss-smaranjit-selected", label: "Romantic & Thriller Stories", bengaliLabel: "রোম্যান্টিক ও থ্রিলার গল্প", sourceWriter: "Smaranjit Chakraborty", writerId: "smaranjit", kind: "writer", playlistId: "PLq71IJk8mCV4uYnNDkPZJ6RI897rlkU5n", videoCount: 0, artwork: writersArtwork },
      { id: "ss-ef-benson", label: "Horror Stories", bengaliLabel: "ভয়ের গল্প", sourceWriter: "E. F. Benson", writerId: "ef-benson", kind: "writer", playlistId: "PLq71IJk8mCV6cG2l7bM4DZysBFSXDrUQ9", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-sunil-pratham-aalo", label: "Pratham Aalo", bengaliLabel: "প্রথম আলো", sourceWriter: "Sunil Gangopadhyay", writerId: "sunil", kind: "writer", playlistId: "PLq71IJk8mCV5tXsmtUfHKXXTbgv86DzJq", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-sunil-selected", label: "History, Romance & Adventure", bengaliLabel: "ইতিহাস, প্রেম ও অভিযান", sourceWriter: "Sunil Gangopadhyay", writerId: "sunil", kind: "writer", playlistId: "PLq71IJk8mCV4pbxHecsU7bS_0PRqm_9Ng", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-subodh-selected", label: "Selected Audio Stories", bengaliLabel: "সুবোধ ঘোষের শ্রেষ্ঠ গল্প", sourceWriter: "Subodh Ghosh", writerId: "subodh", kind: "writer", playlistId: "PLq71IJk8mCV63wA_XSHLY54xM1HUfsurz", videoCount: 0, artwork: writersArtwork },
      { id: "ss-premendra-suspense", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Premendra Mitra", writerId: "premendra", kind: "writer", playlistId: "PLq71IJk8mCV7vvpoCHKWP3OdBIIVYbcxo", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-rabindranath-selected", label: "Golpoguchchho & Selected Works", bengaliLabel: "গল্পগুচ্ছ ও নির্বাচিত রচনা", sourceWriter: "Rabindranath Tagore", writerId: "rabindranath", kind: "writer", playlistId: "PLq71IJk8mCV7Mhou-Z-voWVMtbGtneVqp", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-classics", label: "Friday Classics", bengaliLabel: "শরদিন্দু ক্লাসিকস", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV4uSmu_ant0sTMGUnSfFwmH", videoCount: 0, artwork: writersArtwork },
      { id: "ss-saradindu-sadashib", label: "Sadashib Adventures", bengaliLabel: "সদাশিবের অভিযান", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV6cuOt8SZoV2rMH2HmAiuSb", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-saradindu-jhinder-bandi", label: "Jhinder Bandi", bengaliLabel: "ঝিন্দের বন্দী", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV44iCf-fuVH5lJyW4Vr3s1G", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-saradindu-125", label: "Saradindu 125", bengaliLabel: "শরদিন্দু ১২৫", sourceWriter: "Saradindu Bandyopadhyay", writerId: "saradindu", kind: "writer", playlistId: "PLq71IJk8mCV5wpTr1PHgpL8ht0Gmk-EMM", videoCount: 0, artwork: writersArtwork },
      { id: "ss-satyajit-classics", label: "Friday Classics", bengaliLabel: "সত্যজিৎ রায়ের গল্প", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "writer", playlistId: "PLq71IJk8mCV5UsSq8ZeeEN2T_bE5f5Qt5", videoCount: 0, artwork: feludaArtwork },
      { id: "ss-satyajit-mollah", label: "Mollah Naseeruddin-er Golpo", bengaliLabel: "মোল্লা নাসিরুদ্দিনের গল্প", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "writer", playlistId: "PLq71IJk8mCV5tgfcj9sty8_cwFjVgw78d", videoCount: 0, artwork: writersArtwork },
      { id: "ss-satyajit-phatik-chand", label: "Phatik Chand", bengaliLabel: "ফটিক চাঁদ", sourceWriter: "Satyajit Ray", writerId: "satyajit", kind: "writer", playlistId: "PLq71IJk8mCV4doYdFqS026582Ll86bwp_", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-parashuram", label: "Comedy & Horror Comedy", bengaliLabel: "হাসি ও ভৌতিক হাসির গল্প", sourceWriter: "Parashuram (Rajshekhar Basu)", writerId: "parashuram", kind: "writer", playlistId: "PLq71IJk8mCV5yjzxrDrIELL1V0bAHFZng", videoCount: 0, artwork: writersArtwork },
      { id: "ss-sukumar-ray", label: "Selected Audio Stories", bengaliLabel: "সুকুমার রায়ের গল্প", sourceWriter: "Sukumar Ray", writerId: "sukumar-ray", kind: "writer", playlistId: "PLq71IJk8mCV71S5rQHJ3Al4cNk0qfZTBi", videoCount: 0, artwork: writersArtwork },
      { id: "ss-pracheta-suspense", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Pracheta Gupta", writerId: "pracheta", kind: "writer", playlistId: "PLq71IJk8mCV4bTatR0X7FKjlmI4cwFiIO", videoCount: 0, artwork: writersArtwork },
      { id: "ss-narayan-selected", label: "Tenida & Classic Horror", bengaliLabel: "টেনিদা ও ধ্রুপদী ভয়ের গল্প", sourceWriter: "Narayan Gangopadhyay", writerId: "narayan", kind: "writer", playlistId: "PLq71IJk8mCV6asjuBGiEDSU6OiQ5YjJ-Y", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-gajendra", label: "Bengali Horror Stories", bengaliLabel: "ভয়ের গল্পসমগ্র", sourceWriter: "Gajendra Kumar Mitra", writerId: "gajendra", kind: "writer", playlistId: "PLq71IJk8mCV5-wJq9-UVN1Rir1vfm2p_1", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-debarati-selected", label: "Mystery, History & Emotions", bengaliLabel: "রহস্য, ইতিহাস ও আবেগ", sourceWriter: "Debarati Mukhopadhyay", writerId: "debarati", kind: "writer", playlistId: "PLq71IJk8mCV5SIFbrcWhssYPJ2kV0cojV", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-baisali", label: "Horror Stories", bengaliLabel: "ভয়ের গল্প", sourceWriter: "Baisali Dasgupta Nandi", writerId: "baisali", kind: "writer", playlistId: "PLq71IJk8mCV6spLv8_UKDwN-WeX5w9LmC", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-harinarayan", label: "Classic Horror Stories", bengaliLabel: "ধ্রুপদী ভয়ের গল্প", sourceWriter: "Harinarayan Chattopadhyay", writerId: "harinarayan", kind: "writer", playlistId: "PLq71IJk8mCV46fDYnrV-Vj1bI5gV9Qtq3", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-anish-deb", label: "Horror, Supernatural & Sci-Fi", bengaliLabel: "ভয়, অতিপ্রাকৃত ও কল্পবিজ্ঞান", sourceWriter: "Anish Deb", writerId: "anish-deb", kind: "writer", playlistId: "PLq71IJk8mCV40dHvwnJfi1EBliHpw1sID", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-himadri-kishore", label: "Horror, Mystery & Suspense", bengaliLabel: "ভয়, রহস্য ও সাসপেন্স", sourceWriter: "Himadri Kishore Dasgupta", writerId: "himadri-kishore", kind: "writer", playlistId: "PLq71IJk8mCV7KJX31mYRGYqda5lqbVHHW", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-leela-majumdar", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Leela Majumdar", writerId: "leela-majumdar", kind: "writer", playlistId: "PLq71IJk8mCV5pd-K3yhJgOHtUTJyYnkzo", videoCount: 0, artwork: writersArtwork },
      { id: "ss-bibhutibhushan-selected", label: "Selected Audio Stories", bengaliLabel: "বিভূতিভূষণের গল্প", sourceWriter: "Bibhutibhushan Bandyopadhyay", writerId: "bibhutibhushan", kind: "writer", playlistId: "PLq71IJk8mCV6JjXCn6luXSyM7o_u1xMjo", videoCount: 0, artwork: taranathArtwork },
      { id: "ss-hemendra-kumar-roy", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Hemendra Kumar Roy", writerId: "hemendra-kumar-roy", kind: "writer", playlistId: "PLq71IJk8mCV6FKrRjakGl3DJQywog_fmn", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-bankim-debi-choudhurani", label: "Debi Choudhurani", bengaliLabel: "দেবী চৌধুরাণী", sourceWriter: "Bankim Chandra Chattopadhyay", writerId: "bankim", kind: "writer", playlistId: "PLq71IJk8mCV4KA0AGrSiVFJIhrJQMIzGv", videoCount: 0, artwork: adventureArtwork },
      { id: "ss-manoj-sen", label: "Horror & Thriller Stories", bengaliLabel: "ভয় ও থ্রিলার গল্প", sourceWriter: "Manoj Sen", writerId: "manoj-sen", kind: "writer", playlistId: "PLq71IJk8mCV438v82NxHmrhm6ZG3D9uHr", videoCount: 0, artwork: horrorArtwork },
      { id: "ss-dipanwita-selected", label: "Sunday Suspense Stories", bengaliLabel: "সানডে সাসপেন্স গল্পসমগ্র", sourceWriter: "Dipanwita Roy", writerId: "dipanwita", kind: "writer", playlistId: "PLq71IJk8mCV7VSN2Xiu7TH38ESkmDYktr", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-shirshendu-nrishingha", label: "Nrishingha Rahasya", bengaliLabel: "নৃসিংহ রহস্য", sourceWriter: "Shirshendu Mukhopadhyay", writerId: "shirshendu", kind: "writer", playlistId: "PLq71IJk8mCV6Sd6KyOg_DRQ3vO5VYifh6", videoCount: 0, artwork: detectiveArtwork },
      { id: "ss-dumas-epics", label: "Epics in Bengali", bengaliLabel: "বাংলায় মহাকাব্যিক উপন্যাস", sourceWriter: "Alexandre Dumas", writerId: "alexandre-dumas", kind: "writer", playlistId: "PLq71IJk8mCV4gV2zEj5vNCI9i8m84Zk4u", videoCount: 0, artwork: adventureArtwork },

      { id: "ss-horror", label: "Horror & Black Magic", bengaliLabel: "ভূত, ভয় ও তন্ত্র", kind: "genre", playlistId: "PLq71IJk8mCV5QIERhRQ2n2bJ8EbsYmL_Y", videoCount: 26, artwork: horrorArtwork },
      { id: "ss-haar-heem", label: "Haar Heem Horror", bengaliLabel: "হার হিম হরর", kind: "genre", playlistId: "PLq71IJk8mCV5PPlPiLgKsyguhqXy3I4fw", videoCount: 47, artwork: horrorArtwork },
      { id: "ss-bhoot-shabdhan", label: "Bhoot Hoite Shabdhan", bengaliLabel: "ভূত হইতে সাবধান", kind: "genre", playlistId: "PLq71IJk8mCV6DWEtyeLMFyaevVDCP-IeT", videoCount: 15, artwork: horrorArtwork },
      { id: "ss-romantic", label: "Romantic Web Series", bengaliLabel: "প্রেমের গল্প", kind: "genre", playlistId: "PLq71IJk8mCV5nHKRVI64BOx63mpNXfRiQ", videoCount: 21, artwork: gmtDefault },
      { id: "ss-prem-dot-com", label: "Prem Dot Com", bengaliLabel: "প্রেম ডট কম", kind: "genre", playlistId: "PLq71IJk8mCV5QZ3AWwyekaVyiwounxMAu", videoCount: 10, artwork: gmtDefault },
      { id: "ss-freedom", label: "Freedom Struggle Stories", bengaliLabel: "স্বাধীনতার গল্প", kind: "genre", playlistId: "PLXvVTmxcl8_g", videoCount: 12, artwork: adventureArtwork },
      { id: "ss-rajkahini", label: "Rajkahini", bengaliLabel: "রাজকাহিনী", sourceWriter: "Abanindranath Tagore", writerId: "abanindranath", kind: "genre", playlistId: "PLq71IJk8mCV4RZbUVjav38ua3C3ElBWH8", videoCount: 9, artwork: adventureArtwork },
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
