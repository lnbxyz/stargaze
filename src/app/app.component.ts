import { Component, computed, signal } from '@angular/core';
import { SearchComponent } from './components/search/search.component';
import { Media } from './tokens/interfaces/media.interface';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './components/media/media.component';
import { InfoComponent } from './components/info/info.component';
import { TmdbService } from './services/tmdb.service';
import { forkJoin, take } from 'rxjs';
import { Actor, Character, Credit } from './tokens/interfaces/actor.interface';
import { ActorComponent } from './components/actor/actor.component';
import { TvCastMember } from './tokens/interfaces/tmdb/tv-aggregated-credits.interface';
import { MovieCastMember } from './tokens/interfaces/tmdb/movie-credits.interface';

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
  searchPlaceholder = computed(
    () => `compare with ${this.selected()[0]?.name}`
  );
  showResult = computed(() => this.selected().length === 2);

  // TODO move results to separate component
  actors = signal<Actor[]>([]);

  constructor(private tmdbService: TmdbService) {}

  onItemSelected(item: Media) {
    this.selected.update((selected) => [...selected, item]);

    if (this.showResult()) {
      this.getResult();
    }
  }

  reset() {
    this.selected.set([]);
  }

  getResult() {
    // TODO move results to separate component

    forkJoin(
      this.selected().map((item) =>
        item.type === 'tv'
          ? this.tmdbService.tvAggregatedCredits(item.id).pipe(take(1))
          : this.tmdbService.movieCredits(item.id).pipe(take(1))
      )
    ).subscribe((results) => {
      const result: Actor[] = [];
      results[0].cast.forEach((castMember) => {
        const match = results[1].cast.find(
          (item) => castMember.name === item.name
        );
        if (!match) return;

        result.push({
          id: castMember.id,
          name: castMember.name,
          picture: castMember.profile_path,
          credits: this.selected().map((media, index) => {
            const cast = [castMember, match][index];
            return <Credit>{
              media: media,
              characters:
                media.type === 'tv'
                  ? (cast as TvCastMember).roles.map((role) => {
                      return <Character>{
                        name: role.character,
                        episodeCount: role.episode_count,
                      };
                    })
                  : [
                      {
                        name: (cast as MovieCastMember).character,
                      },
                    ],
            };
          }),
        });
      });

      this.actors.set(result);
    });
  }
}
