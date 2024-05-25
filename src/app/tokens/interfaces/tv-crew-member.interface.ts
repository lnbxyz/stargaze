import { TvCrewMemberJob } from './tv-crew-member-job.interface';

export interface TvCrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  jobs: TvCrewMemberJob[];
  total_episode_count: number;
  order: number;
}
