import { TvCastMemberRole } from './tv-cast-member-role.interface';

export interface TvCastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  roles: TvCastMemberRole[];
  total_episode_count: number;
  order: number;
}
