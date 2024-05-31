import { Media } from './media.interface';

export interface Actor {
  id: number;
  name: string;
  picture: string;
  credits: Credit[];
}

export interface Credit {
  media: Media;
  characters: Character[];
}

export interface Character {
  name: string;
  episodeCount?: number;
}
