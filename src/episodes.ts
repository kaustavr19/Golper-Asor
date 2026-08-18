export interface Episode {
  id: string; // YouTube video id
  titleEn: string;
  titleBn?: string;
  titleIsFallback?: boolean;
  series?: string;
  author?: string;
  duration?: string; // fallback display duration, "mm:ss" — overwritten once real duration is known
}

export interface EpisodeSource {
  channelId: string;
  collectionId: string;
  collectionLabel: string;
  playlistId: string;
}

export interface QueueEpisode extends Episode {
  source: EpisodeSource;
}
