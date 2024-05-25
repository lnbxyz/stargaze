import { Component, computed, signal } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { Media } from './tokens/interfaces/media.interface';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './components/media/media.component';
import { InfoComponent } from './components/info/info.component';

@Component({
  selector: 's-root',
  standalone: true,
  imports: [SearchComponent, CommonModule, MediaComponent, InfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  selected = signal<Media[]>([]);
  searchPlaceholder = computed(() => `compare with ${this.selected()[0].name}`);
  showResult = computed(() => this.selected().length === 2);

  onItemSelected(item: Media) {
    this.selected.update((selected) => [
      ...selected,
      { ...item, poster: item.poster.replace('/w92/', '/w342/') },
    ]);
  }
}
