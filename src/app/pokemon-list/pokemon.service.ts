import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=1100';
  private habitatUrl = 'https://pokeapi.co/api/v2/pokemon-habitat';

  constructor(private http: HttpClient) { }

  getPokemons(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results),
      switchMap((results: any[]) =>
        forkJoin(results.map((pokemon: any) => this.getPokemonDetails(pokemon.url)))
      )
    );
  }

  private getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      switchMap(pokemon =>
        this.getPokemonHabitat(pokemon.species.url).pipe(
          map(habitat => ({
            ...pokemon,
            habitat: habitat || 'desconhecido'
          }))
        )
      )
    );
  }

  private getPokemonHabitat(url: string): Observable<string> {
    return this.http.get<any>(url).pipe(
      map(speciesData => speciesData.habitat?.name)
    );
  }

  getPokemonHabitats(): Observable<string[]> {
    return this.http.get<any>(this.habitatUrl).pipe(
      map((response) => response.results.map((habitat: any) => habitat.name))
    );
  }
}
