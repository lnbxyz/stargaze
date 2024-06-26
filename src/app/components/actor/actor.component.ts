import { Component, HostListener, input, signal } from '@angular/core';
import { Actor } from '../../tokens/interfaces/actor.interface';
import { CommonModule, IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { TMDB_IMAGE_LOADER } from '../../tokens/consts/tmdb-image-loader.const';

@Component({
  selector: 's-actor',
  standalone: true,
  templateUrl: 'actor.component.html',
  styleUrl: 'actor.component.scss',
  imports: [NgOptimizedImage, CommonModule],
  providers: [{ provide: IMAGE_LOADER, useValue: TMDB_IMAGE_LOADER }],
})
export class ActorComponent {
  actor = input.required<Actor>();
  width = signal(window.innerWidth);

  @HostListener('window:resize')
  onWindowResize() {
    this.width.set(window.innerWidth);
  }
}
