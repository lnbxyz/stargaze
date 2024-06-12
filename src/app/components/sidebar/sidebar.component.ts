import { Component, computed, effect, signal } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Media } from '../../tokens/interfaces/media.interface';
import { MediaComponent } from '../media/media.component';
import { SearchComponent } from '../search/search.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [MediaComponent, SearchComponent, NgOptimizedImage],
  providers: [
    DatePipe,
    {
      provide: IMAGE_LOADER,
      useValue: TMDB_IMAGE_LOADER,
    },
  ],
  animations: [
    trigger('smoothInOut', [
      transition(':enter', [
        style({
          flex: 0,
          height: 0,
          opacity: 0,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: '*',
            height: '*',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          flex: '*',
          height: '*',
          opacity: 1,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: 0,
            height: 0,
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  showSearch = signal(false);

  media = computed(() =>
    this.storeService.media().map((item) => {
      return {
        ...item,
        name: `${item.name}${
          item.date ? ' (' + this.datePipe.transform(item.date, 'y') + ')' : ''
        }`,
      };
    })
  );

  constructor(public storeService: StoreService, private datePipe: DatePipe) {
    effect(
      () => {
        if (this.storeService.media().length) {
          this.showSearch.set(false);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  onBackPressed() {
    this.storeService.media.set([]);
  }

  onAddMediaPressed() {
    this.showSearch.set(true);
  }

  removeMedia(media: Media) {
    this.storeService.media.update((current) =>
      current.filter((item) => item.id !== media.id)
    );
  }
}
