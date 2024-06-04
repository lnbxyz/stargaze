import { Component, computed, effect } from '@angular/core';
import { SearchComponent } from '../../components/search/search.component';
import { Media } from '../../tokens/interfaces/media.interface';
import { MediaComponent } from '../../components/media/media.component';
import { InfoComponent } from '../../components/info/info.component';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';

@Component({
  selector: 's-home',
  standalone: true,
  imports: [SearchComponent, MediaComponent, InfoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  choice = computed(() => this.storeService.media()[0]);
  searchPlaceholder = computed(() => `compare with ${this.choice()?.name}`);

  constructor(public storeService: StoreService, private router: Router) {
    this.storeService.media.set([]);

    effect(() => {
      if (this.storeService.media().length === 2) {
        this.router.navigate(['compare']);
      }
    });
  }

  onItemSelected(item: Media) {
    this.storeService.media.update((media) => [...media, item]);
  }
}
