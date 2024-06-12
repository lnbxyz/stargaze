import { Component, effect, signal } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 's-result',
  standalone: true,
  imports: [CommonModule, ActorComponent, SidebarComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultPageComponent {
  actors = signal<Actor[]>([]);
  loading = signal(true);

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
}
