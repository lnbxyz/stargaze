export interface MovieCredits {
  id: number;
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}

export interface MovieCastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieCrewMember {
  adult: false;
  gender: 2;
  id: 1;
  known_for_department: 'Directing';
  name: 'George Lucas';
  original_name: 'George Lucas';
  popularity: 38.194;
  profile_path: '/WCSZzWdtPmdRxH9LUCVi2JPCSJ.jpg';
  credit_id: '562e75309251414006009955';
  department: 'Writing';
  job: 'Writer';
}
