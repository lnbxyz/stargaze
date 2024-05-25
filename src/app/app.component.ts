import { Component, computed, signal } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { Media } from './tokens/interfaces/media.interface';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './components/media/media.component';
import { InfoComponent } from './components/info/info.component';
import { TmdbService } from './services/tmdb.service';
import { forkJoin, take } from 'rxjs';
import { Actor } from './tokens/interfaces/actor.interface';
import { ActorComponent } from './components/actor/actor.component';

@Component({
  selector: 's-root',
  standalone: true,
  imports: [
    SearchComponent,
    CommonModule,
    MediaComponent,
    InfoComponent,
    ActorComponent,
  ],
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
          picture: `https://image.tmdb.org/t/p/w185${mediaOneActor.profile_path}`,
          media: [
            {
              name: this.selected()[0].name,
              credits: mediaOneActor.roles.map((role) => {
                return {
                  character: role.character,
                  episodeCount: role.episode_count,
                };
              }),
            },
            {
              name: this.selected()[1].name,
              credits: mediaTwoActor.roles.map((role) => {
                return {
                  character: role.character,
                  episodeCount: role.episode_count,
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
