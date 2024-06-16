export interface TvDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: TvCreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TvGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TvEpisode;
  name: string;
  next_episode_to_air: TvEpisode;
  networks: TvNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TvProductionCompany[];
  production_countries: TvProductionCountry[];
  seasons: TvSeason[];
  spoken_languages: TvLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface TvSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TvLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TvProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TvProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TvEpisode {
  id: number;
  overview: string;
  name: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface TvNetwork {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface TvGenre {
  id: number;
  name: string;
}

export interface TvCreatedBy {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string;
}
