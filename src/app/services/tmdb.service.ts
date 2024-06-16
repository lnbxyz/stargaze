import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResponse } from '../tokens/interfaces/tmdb/paged-response.interface';
import { TvResult } from '../tokens/interfaces/tmdb/tv-result.interface';
import { MovieResult } from '../tokens/interfaces/tmdb/movie-result.interface';
import { TvAggregatedCredits } from '../tokens/interfaces/tmdb/tv-aggregated-credits.interface';
import { MovieCredits } from '../tokens/interfaces/tmdb/movie-credits.interface';
import { TvDetails } from '../tokens/interfaces/tmdb/tv-details.interface';
import { MovieDetails } from '../tokens/interfaces/tmdb/movie-details.interface';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  constructor(private httpClient: HttpClient) {}

  search(query: string, page = 1) {
    const url = 'https://api.themoviedb.org/3/search/multi';
    const params = new HttpParams({
      fromObject: {
        query,
        page,
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<PagedResponse<TvResult | MovieResult>>(url, {
      params,
    });
  }

  tvAggregatedCredits(id: number) {
    const url = `https://api.themoviedb.org/3/tv/${id}/aggregate_credits`;
    const params = new HttpParams({
      fromObject: {
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<TvAggregatedCredits>(url, { params });
  }

  movieCredits(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits`;
    const params = new HttpParams({
      fromObject: {
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<MovieCredits>(url, { params });
  }

  tvDetails(id: number) {
    const url = `https://api.themoviedb.org/3/tv/${id}`;
    const params = new HttpParams({
      fromObject: {
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<TvDetails>(url, { params });
  }

  movieDetails(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const params = new HttpParams({
      fromObject: {
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<MovieDetails>(url, { params });
  }
}
