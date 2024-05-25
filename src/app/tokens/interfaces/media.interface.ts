import { MovieResult } from './movie-result.interface';
import { TvResult } from './tv-result.interface';

export interface Media {
  name: string;
  type: 'tv' | 'movie';
  poster: string;
  date: string;
  popularity: number;
  original: TvResult | MovieResult;
}
