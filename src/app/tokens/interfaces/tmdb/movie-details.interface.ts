export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: MovieGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: MovieProductionCompany[];
  production_countries: MovieProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: MovieLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface MovieGenre {
  id: number;
  name: string;
}

interface MovieProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface MovieProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface MovieLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}
