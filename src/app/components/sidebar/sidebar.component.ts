import {
  Component,
  HostListener,
  computed,
  effect,
  output,
  signal,
} from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Media } from '../../tokens/interfaces/media.interface';
import { MediaComponent } from '../media/media.component';
import { SearchComponent } from '../search/search.component';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  CommonModule,
  DatePipe,
  IMAGE_LOADER,
  NgOptimizedImage,
} from '@angular/common';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [MediaComponent, SearchComponent, NgOptimizedImage, CommonModule],
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
          margin: 0,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: '*',
            height: '*',
            margin: '*',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          flex: '*',
          height: '*',
          margin: '*',
          opacity: 1,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: 0,
            height: 0,
            opacity: 0,
            margin: 0,
          })
        ),
      ]),
    ]),
    trigger('searchInOut', [
      transition(':enter', [
        style({
          flex: 0,
          opacity: 0,
          margin: 0,
          overflow: 'hidden',
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: '*',
            opacity: 1,
            margin: '*',
            overflow: 'hidden',
          })
        ),
      ]),
      transition('compact => void', [
        style({
          opacity: 1,
          transform: 'translateY(0)',
          overflow: 'hidden',
          height: '*',
          margin: '*',
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            opacity: 0,
            height: 0,
            margin: 0,
          })
        ),
      ]),
      transition('fullheight => void', [
        style({
          flex: '*',
          opacity: 1,
          transform: 'translateY(0)',
          overflow: 'hidden',
          height: '*',
          margin: '*',
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: 0,
            opacity: 0,
            height: 0,
            margin: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  showSearch = signal(false);
  searchOpen = output<boolean>();
  width = signal(window.innerWidth);

  @HostListener('window:resize')
  onWindowResize() {
    this.width.set(window.innerWidth);
  }

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

    effect(() => {
      this.searchOpen.emit(this.showSearch());
    });
  }

  onBackPressed() {
    this.storeService.media.set([]);
  }

  onToggleSearchPressed() {
    this.showSearch.update((value) => !value);
  }

  removeMedia(media: Media) {
    this.storeService.media.update((current) =>
      current.filter((item) => item.id !== media.id)
    );
  }
}
