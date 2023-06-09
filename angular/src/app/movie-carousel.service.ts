import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { movieSearchUrl } from "src/app/config";

const defaultLoadedMovies = [
  "The Godfather",
  "Casablanca",
  "Gone with the Wind",
  "Citizen Kane",
  "Psycho",
  "Vertigo",
  "Singin' in the Rain",
  "The Wizard of Oz",
  "Lawrence of Arabia",
  "Schindler's List",
];

export type CarouselMovie = {
  title: string;
  year: string;
  poster: string;
  score: number;
  rating: string;
  lengthMinutes: number;
  description: string;
  directors: string[];
  actors: string[];
  genres: string[];
  imdbId: string;
  tmdbId: number;
};

@Injectable({
  providedIn: "root",
})
export class MovieCarouselService {
  constructor() {}
  moviesSubject = new BehaviorSubject<CarouselMovie[]>([]);

  async load(query?: string[]): Promise<void> {
    if (!query) {
      query = defaultLoadedMovies;
    }
    let movies: CarouselMovie[] = [];
    movies = await this.searchMovies(query);
    console.log(movies);
    this.moviesSubject.next(movies);
  }

  getMovies(): Observable<CarouselMovie[]> {
    return this.moviesSubject;
  }

  private async searchMovies(query: string[]): Promise<CarouselMovie[]> {
    for (let retires = 0; retires < 3; retires++) {
      try {
        let resp = await fetch(movieSearchUrl, {
          method: "POST",
          body: JSON.stringify({
            query,
          }),
        });
        return await resp.json();
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        continue;
      }
    }
    return [];
  }
}
