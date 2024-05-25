import { TvCastMember } from './tv-cast-member.interface';
import { TvCrewMember } from './tv-crew-member.interface';

export interface TvAggregatedCredits {
  id: number;
  cast: TvCastMember[];
  crew: TvCrewMember[];
}
