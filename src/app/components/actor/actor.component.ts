import { Component, input } from '@angular/core';
import { Actor } from '../../tokens/interfaces/actor.interface';

@Component({
  selector: 's-actor',
  standalone: true,
  templateUrl: 'actor.component.html',
  styleUrl: 'actor.component.scss',
})
export class ActorComponent {
  actor = input.required<Actor>();

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = '/profile-error.png';
  }
}
