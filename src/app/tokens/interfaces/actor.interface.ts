export interface Actor {
  name: string;
  shows: ActorShow[];
}

interface ActorShow {
  name: string;
  episodes: ActorShowEpisode[];
}

interface ActorShowEpisode {
  name: string;
  season: number;
  episodeNumber: number;
  character: string;
}
