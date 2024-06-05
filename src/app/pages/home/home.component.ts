import { Component, computed, effect } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { Media } from '../../tokens/interfaces/media.interface';
import { MediaComponent } from '../../components/media/media.component';
import { InfoComponent } from '../../components/info/info.component';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 's-home',
  standalone: true,
  imports: [SearchComponent, MediaComponent, InfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          height: 0,
          margin: 0,
          opacity: 0,
          transform: 'translateY(-8rem)',
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            height: '*',
            margin: '*',
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  choice = computed<Media | undefined>(() => this.storeService.media()[0]);

  constructor(public storeService: StoreService, private router: Router) {
    this.storeService.media.set([]);

    effect(() => {
      if (this.storeService.media().length === 2) {
        this.router.navigate(['compare']);
      }
    });
  }
}
