export interface Media {
  id: number;
  name: string;
  type: 'tv' | 'movie';
  poster?: string;
  date: string;
}
