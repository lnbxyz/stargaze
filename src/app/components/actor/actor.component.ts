import { Component, input } from '@angular/core';
import { Actor } from '../../tokens/interfaces/actor.interface';
import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-actor',
  standalone: true,
  templateUrl: 'actor.component.html',
  styleUrl: 'actor.component.scss',
  imports: [NgOptimizedImage],
  providers: [{ provide: IMAGE_LOADER, useValue: TMDB_IMAGE_LOADER }],
})
export class ActorComponent {
  actor = input.required<Actor>();
}
