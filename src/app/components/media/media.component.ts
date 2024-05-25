import { Component, computed, input } from '@angular/core';
import { Media } from '../../tokens/interfaces/media.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 's-media',
  standalone: true,
  templateUrl: 'media.component.html',
  styleUrl: './media.component.scss',
  providers: [DatePipe],
})
export class MediaComponent {
  media = input.required<Media>();
  size = input<'small' | 'medium' | 'large'>('medium');

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
