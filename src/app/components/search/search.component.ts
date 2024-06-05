import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Subject,
  concatMap,
  debounceTime,
  filter,
  map,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';
import { TvResult } from '../../tokens/interfaces/tmdb/tv-result.interface';
import { MovieResult } from '../../tokens/interfaces/tmdb/movie-result.interface';
import { StoreService } from '../../services/store.service';
import { animate, style, transition, trigger } from '@angular/animations';

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
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({
          opacity: 0,
          height: 0,
          padding: 0,
          borderWidth: 0,
        }),
        animate(
          '250ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            opacity: 1,
            height: '*',
            padding: '*',
            borderWidth: '*',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '250ms cubic-bezier(0.64, 0, 0.78, 0)',
          style({
            opacity: 0,
            height: 0,
            padding: 0,
            borderWidth: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchFormControl = new FormControl<string | null>('');
  end = new Subject<void>();
  results = signal<Media[]>([]);
  searchRef = viewChild<ElementRef<HTMLInputElement>>('search');

  constructor(
    private tmdbService: TmdbService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.listenToChanges();
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  listenToChanges(): void {
    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.end),
        tap((value) => !value && this.results.set([])),
        filter((value) => !!value),
        debounceTime(200)
      )
      .subscribe((value) => {
        this.tmdbService
          .search(value!)
          .pipe(
            take(1),
            takeUntil(this.end),
            concatMap((result) => {
              if (
                result.results.filter((item) =>
                  ['tv', 'movie'].includes(item.media_type)
                ).length <
                result.results.length / 2
              ) {
                return this.tmdbService.search(value ?? '', 2).pipe(
                  take(1),
                  takeUntil(this.end),
                  map((newResult) => {
                    result.results = [...result.results, ...newResult.results];
                    return result;
                  })
                );
              }
              return of(result);
            }),
            map(
              (result) =>
                result.results
                  .map((item) => {
                    if (!['tv', 'movie'].includes(item.media_type)) {
                      return null;
                    }
                    return <Media>{
                      id: item.id,
                      type: item.media_type,
                      name:
                        item.media_type === 'tv'
                          ? (item as TvResult).name
                          : (item as MovieResult).title,
                      date:
                        item.media_type === 'tv'
                          ? (item as TvResult).first_air_date
                          : (item as MovieResult).release_date,
                      poster: item.poster_path,
                    };
                  })
                  .filter((item) => item !== null) as Media[]
            )
          )
          .subscribe((response) => this.results.set(response));
      });
  }

  onMediaSelected(selected: Media) {
    this.storeService.media.update((media) => [...media, selected]);
    this.searchFormControl.reset();
    this.searchRef()?.nativeElement.focus();
  }
}
