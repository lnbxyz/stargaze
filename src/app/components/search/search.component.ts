import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, forkJoin, map, take, takeUntil } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';

@Component({
  selector: 's-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  searchFormControl = new FormControl<string | null>('');
  end = new Subject<void>();
  results = signal<Media[]>([]);

  constructor(private tmdbService: TmdbService) {}

  ngOnInit(): void {
    this.listenToChanges();
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  listenToChanges(): void {
    this.searchFormControl.valueChanges
      .pipe(takeUntil(this.end), debounceTime(200))
      .subscribe((value) => {
        forkJoin([
          this.tmdbService.searchMovie(value ?? '').pipe(
            take(1),
            takeUntil(this.end),
            map((value) =>
              value.results.map((item) => {
                return <Media>{
                  type: 'movie',
                  name: item.title,
                  date: item.release_date,
                  poster: item.poster_path,
                  popularity: item.popularity,
                };
              })
            )
          ),
          this.tmdbService.searchTv(value ?? '').pipe(
            take(1),
            takeUntil(this.end),
            map((value) =>
              value.results.map((item) => {
                return <Media>{
                  type: 'tv',
                  name: item.name,
                  date: item.first_air_date,
                  poster: item.poster_path,
                  popularity: item.popularity,
                };
              })
            )
          ),
        ]).subscribe(([movies, tvShows]) =>
          this.results.set(
            [...tvShows, ...movies].sort((a, b) => b.popularity - a.popularity)
          )
        );
      });
  }
}
