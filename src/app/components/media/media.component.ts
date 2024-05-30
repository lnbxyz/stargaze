import { Component, computed, input } from '@angular/core';
import { Media } from '../../tokens/interfaces/media.interface';
import { DatePipe, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-media',
  standalone: true,
  templateUrl: 'media.component.html',
  styleUrl: './media.component.scss',
  imports: [NgOptimizedImage],
  providers: [
    DatePipe,
    {
      provide: IMAGE_LOADER,
      useValue: TMDB_IMAGE_LOADER,
    },
  ],
})
export class MediaComponent {
  media = input.required<Media>();
  size = input<'small' | 'medium' | 'large'>('medium');
  imageWidth = computed(() => {
    switch (this.size()) {
      case 'small':
        return 28;
      case 'medium':
        return 56;
      case 'large':
        return 224;
    }
  });

  imageHeight = computed(() => {
    switch (this.size()) {
      case 'small':
        return 41;
      case 'medium':
        return 83;
      case 'large':
        return 332;
    }
  });

  description = computed(
    () =>
      `${this.media().type === 'tv' ? 'TV Show' : 'Movie'}${
        this.media().date
          ? ' · ' + this.datePipe.transform(this.media().date, 'y')
          : ''
      }`
  );

  constructor(private datePipe: DatePipe) {}
}
