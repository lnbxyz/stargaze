import {
  Component,
  OnDestroy,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, map, take, takeUntil } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { CommonModule, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';
import { TvResult } from '../../tokens/interfaces/tv-result.interface';
import { MovieResult } from '../../tokens/interfaces/movie-result.interface';

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
        this.tmdbService
          .search(value ?? '')
          .pipe(
            take(1),
            takeUntil(this.end),
            map(
              (value) =>
                value.results
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

  onResultClick(result: Media) {
    this.itemSelected.emit(result);
  }
}
