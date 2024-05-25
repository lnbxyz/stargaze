import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PagedResponse } from '../tokens/interfaces/paged-response.interface';
import { MovieResult } from '../tokens/interfaces/movie-result.interface';
import { TvResult } from '../tokens/interfaces/tv-result.interface';
import { TvAggregatedCredits } from '../tokens/interfaces/tv-aggregated-credits.interface';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  constructor(private httpClient: HttpClient) {}

  searchMovie(query: string) {
    const url = 'https://api.themoviedb.org/3/search/movie';
    const params = new HttpParams({
      fromObject: {
        query,
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<PagedResponse<MovieResult>>(url, { params });
  }

  searchTv(query: string) {
    const url = 'https://api.themoviedb.org/3/search/tv';
    const params = new HttpParams({
      fromObject: {
        query,
        api_key: environment.tmdbApiKey,
      },
    });
    return this.httpClient.get<PagedResponse<TvResult>>(url, { params });
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
}
