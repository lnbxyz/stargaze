import { Component, HostListener, effect, signal } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Media } from '../../tokens/interfaces/media.interface';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { TvDetails } from '../../tokens/interfaces/tmdb/tv-details.interface';
import { MovieDetails } from '../../tokens/interfaces/tmdb/movie-details.interface';

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
  resolvedQueryParams = signal(false);
  width = signal(window.innerWidth);

  @HostListener('window:resize')
  onWindowResize() {
    this.width.set(window.innerWidth);
  }

  constructor(
    private tmdbService: TmdbService,
    private storeService: StoreService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((query) => {
      const params: string[] =
        typeof query['m'] === 'string' ? [query['m']] : query['m'];

      const media: { type: string; id: number }[] = params.map(
        (param: string) => {
          const [type, id] = param.split('_');
          return { type, id: Number(id) };
        }
      );

      if (!media.length) {
        this.router.navigate(['']);
      }

      if (this.storeService.media().length) {
        this.resolvedQueryParams.set(true);
        return;
      }

      forkJoin(
        media.map((item) =>
          item.type === 'tv'
            ? this.tmdbService.tvDetails(item.id).pipe(take(1))
            : this.tmdbService.movieDetails(item.id).pipe(take(1))
        )
      ).subscribe((results: Array<TvDetails | MovieDetails>) => {
        this.storeService.media.set(
          results.map((result) => {
            const type = media.find((media) => media.id === result.id)?.type;
            return <Media>{
              id: result.id,
              type: type,
              name:
                type === 'tv'
                  ? (result as TvDetails).name
                  : (result as MovieDetails).title,
              date:
                type === 'tv'
                  ? (result as TvDetails).first_air_date
                  : (result as MovieDetails).release_date,
              poster: result.poster_path,
            };
          })
        );

        this.resolvedQueryParams.set(true);
      });
    });

    effect(
      () => {
        if (!this.resolvedQueryParams()) return;
        if (!this.storeService.media().length) {
          this.router.navigate(['']);
        }
        this.updateQueryParams();
        this.getResult([...this.storeService.media()]);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  private updateQueryParams() {
    const currentUrl = this.location.path();
    const urlTree = new URL(currentUrl, window.location.origin);
    urlTree.searchParams.delete('m');
    this.storeService.media().forEach((media) => {
      urlTree.searchParams.append('m', `${media.type}_${media.id}`);
    });
    this.location.replaceState(urlTree.pathname + urlTree.search);
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
