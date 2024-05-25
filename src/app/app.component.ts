import { Component, computed, signal } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { Media } from './tokens/interfaces/media.interface';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './components/media/media.component';
import { InfoComponent } from './components/info/info.component';
import { TmdbService } from './services/tmdb.service';
import { forkJoin, take } from 'rxjs';
import { Actor } from './tokens/interfaces/actor.interface';

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

  // TODO move results to separate component
  actors = signal<Actor[]>([]);

  constructor(private tmdbService: TmdbService) {}

  onItemSelected(item: Media) {
    this.selected.update((selected) => [
      ...selected,
      { ...item, poster: item.poster.replace('/w92/', '/w342/') },
    ]);

    if (this.showResult()) {
      this.getResult();
    }
  }

  getResult() {
    // TODO move results to separate component

    forkJoin([
      this.tmdbService
        .tvAggregatedCredits(this.selected()[0].original.id)
        .pipe(take(1)),
      this.tmdbService
        .tvAggregatedCredits(this.selected()[1].original.id)
        .pipe(take(1)),
    ]).subscribe(([mediaOne, mediaTwo]) => {
      const result: Actor[] = [];
      mediaOne.cast.forEach((mediaOneActor) => {
        const mediaTwoActor = mediaTwo.cast.find(
          (item) => mediaOneActor.name === item.name
        );
        if (!mediaTwoActor) return;

        result.push({
          name: mediaOneActor.name,
          shows: [
            {
              name: this.selected()[0].name,
              episodes: mediaOneActor.roles.map((role) => {
                return {
                  name: 'episode',
                  episodeNumber: 1,
                  season: 1,
                  character: role.character,
                };
              }),
            },
            {
              name: this.selected()[1].name,
              episodes: mediaTwoActor.roles.map((role) => {
                return {
                  name: 'episode',
                  episodeNumber: 1,
                  season: 1,
                  character: role.character,
                };
              }),
            },
          ],
        });
      });

      this.actors.set(result);
    });
  }
}
