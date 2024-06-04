import { Injectable, signal } from '@angular/core';
import { Media } from '../tokens/interfaces/media.interface';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  media = signal<Media[]>([]);
}
