export interface TvAggregatedCredits {
  id: number;
  cast: TvCastMember[];
  crew: TvCrewMember[];
}

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

export interface TvCastMemberRole {
  credit_id: string;
  character: string;
  episode_count: number;
}

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

export interface TvCrewMemberJob {
  credit_id: string;
  job: string;
  episode_count: number;
}
