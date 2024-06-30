import { Component, effect } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { TitleComponent } from '../../components/title/title.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 's-home',
  standalone: true,
  imports: [SearchComponent, TitleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('titleSlideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(4rem)',
        }),
        animate(
          '750ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
    trigger('searchSlideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(4rem)',
        }),
        animate(
          '500ms 250ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            opacity: 1,
            transform: 'translateY(0)',
          })
        ),
      ]),
    ]),
  ],
})
export class HomePageComponent {
  constructor(public storeService: StoreService, private router: Router) {
    this.storeService.media.set([]);

    effect(() => {
      if (this.storeService.media().length > 0) {
        this.router.navigate(['view'], {
          queryParams: {
            m: this.storeService.media().map((m) => `${m.type}_${m.id}`),
          },
        });
      }
    });
  }
}
