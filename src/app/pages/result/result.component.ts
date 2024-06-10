import { Component, effect, signal } from '@angular/core';
import { MediaComponent } from '../../components/media/media.component';
import { InfoComponent } from '../../components/info/info.component';
import { TmdbService } from '../../services/tmdb.service';
import { forkJoin, take } from 'rxjs';
import {
  Actor,
  Character,
  Credit,
} from '../../tokens/interfaces/actor.interface';
import { ActorComponent } from '../../components/actor/actor.component';
import { TvCastMember } from '../../tokens/interfaces/tmdb/tv-aggregated-credits.interface';
import { MovieCastMember } from '../../tokens/interfaces/tmdb/movie-credits.interface';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { SearchComponent } from '../../components/search/search.component';
import { CommonModule } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 's-result',
  standalone: true,
  imports: [
    CommonModule,
    MediaComponent,
    InfoComponent,
    ActorComponent,
    SearchComponent,
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  animations: [
    trigger('smoothInOut', [
      transition(':enter', [
        style({
          flex: 0,
          height: 0,
          opacity: 0,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: '*',
            height: '*',
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({
          flex: '*',
          height: '*',
          opacity: 1,
        }),
        animate(
          '500ms cubic-bezier(0.22, 1, 0.36, 1)',
          style({
            flex: 0,
            height: 0,
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class ResultPageComponent {
  actors = signal<Actor[]>([]);
  loading = signal(true);
  showSearch = signal(false);

  constructor(
    private tmdbService: TmdbService,
    public storeService: StoreService,
    private router: Router
  ) {
    effect(
      () => {
        if (this.storeService.media().length < 2) {
          this.router.navigate(['']);
        } else {
          this.showSearch.set(false);
          this.getResult([...this.storeService.media()]);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  getResult(media: Media[]) {
    this.loading.set(true);

    forkJoin(
      media.map((item) =>
        item.type === 'tv'
          ? this.tmdbService.tvAggregatedCredits(item.id).pipe(take(1))
          : this.tmdbService.movieCredits(item.id).pipe(take(1))
      )
    ).subscribe((results) => {
      const result: Actor[] = [];
      const first = results.shift();

      if (!first) return;

      first.cast.forEach((castMember) => {
        const matches: Array<TvCastMember | MovieCastMember> = [];

        results.forEach((result) => {
          const match = result.cast.find(
            (item) => castMember.name === item.name
          );
          if (match) {
            matches.push(match);
          }
        });

        if (matches.length !== media.length - 1) return;

        result.push({
          id: castMember.id,
          name: castMember.name,
          picture: castMember.profile_path,
          credits: media.map((media, index) => {
            const cast = [castMember, ...matches][index];
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
      this.loading.set(false);
    });
  }

  onBackPressed() {
    this.storeService.media.set([]);
  }

  onAddMediaPressed() {
    this.showSearch.set(true);
  }

  removeMedia(media: Media) {
    this.storeService.media.update((current) =>
      current.filter((item) => item.id !== media.id)
    );
  }
}
