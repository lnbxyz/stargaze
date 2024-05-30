import {
  Component,
  OnDestroy,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, forkJoin, map, take, takeUntil } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [ReactiveFormsModule, CommonModule, NgOptimizedImage],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: TMDB_IMAGE_LOADER,
    },
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchFormControl = new FormControl<string | null>('');
  end = new Subject<void>();
  results = signal<Media[]>([]);
  itemSelected = output<Media>();
  placeholder = input('search for a TV show or movie');

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
                  original: item,
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
                  original: item,
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

  onResultClick(result: Media) {
    this.itemSelected.emit(result);
  }
}
