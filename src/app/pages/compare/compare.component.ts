import { Component, OnInit, effect, signal } from '@angular/core';
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

@Component({
  selector: 's-compare',
  standalone: true,
  imports: [MediaComponent, InfoComponent, ActorComponent],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent implements OnInit {
  actors = signal<Actor[]>([]);

  constructor(
    private tmdbService: TmdbService,
    public storeService: StoreService,
    private router: Router
  ) {
    effect(() => {
      if (this.storeService.media().length < 2) {
        this.router.navigate(['']);
      }
    });
  }

  ngOnInit(): void {
    this.getResult();
  }

  getResult() {
    forkJoin(
      this.storeService
        .media()
        .map((item) =>
          item.type === 'tv'
            ? this.tmdbService.tvAggregatedCredits(item.id).pipe(take(1))
            : this.tmdbService.movieCredits(item.id).pipe(take(1))
        )
    ).subscribe(([one, two]) => {
      const result: Actor[] = [];
      one.cast.forEach((castMember) => {
        const match = two.cast.find((item) => castMember.name === item.name);
        if (!match) return;

        result.push({
          id: castMember.id,
          name: castMember.name,
          picture: castMember.profile_path,
          credits: this.storeService.media().map((media, index) => {
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

  reset() {
    this.storeService.media.set([]);
  }
}
