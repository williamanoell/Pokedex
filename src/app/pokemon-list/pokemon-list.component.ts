import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';
import { PokemonService } from './pokemon.service';

@Component({
  selector: 'pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  paginatedPokemons: any[] = [];
  pokemonTypes: { [key: string]: string } = {};
  pokemonHabitats: string[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  selectedHabitat: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  showFilters = false;
  isLoading = false;

  private typeColors: { [key: string]: string } = {
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  };

  title: string = "https://camo.githubusercontent.com/cd58fcd6ccf163e749e63d8310f506fbe920978c73600a5f47619ede74ce12f2/68747470733a2f2f696b2e696d6167656b69742e696f2f6877796b73766a3469762f706f6b656465785f4e5f576757724a4b30732e706e67";

  constructor(
    private pokemonService: PokemonService,
    private dialog: MatDialog,
    private translate: TranslateService) {
    this.translate.setDefaultLang('pt');
  }

  ngOnInit(): void {
    this.loadPokemons();
    this.translate.use('pt');
  }

  toggleFilterMenu() {
    this.showFilters = !this.showFilters;
  }

  loadPokemons(): void {
    this.isLoading = true;
    this.pokemonService.getPokemons().subscribe((pokemons) => {
      this.pokemons = pokemons;
      this.pokemonTypes = this.getAllTypes(pokemons);
      this.getAllHabitats();
      this.applyFilters();
      this.isLoading = false;
    });
  }

  getAllTypes(pokemons: any[]): { [key: string]: string } {
    const types = pokemons.flatMap(pokemon =>
      pokemon.types.map((type: any) => ({
        name: type.type.name,
        color: this.typeColors[type.type.name] || '#c9c7c7',
      }))
    );

    return types.reduce((acc: any, type: any) => {
      acc[type.name] = type.color;
      return acc;
    }, {});
  }

  getTypeIcon(type: string): string {
    return `https://pokedex-ib.vercel.app/images/types-icons/${type}.svg`;
  }

  getTypeTranslation(type: string): string {
    var translatedTypes = '';
    this.translate.get(`types.${type}`).subscribe((translation) => {
      translatedTypes = translation;
    });
    return translatedTypes || type;
  }

  getAllHabitats(): void {
    this.pokemonService.getPokemonHabitats().subscribe((habitats) => {
      this.pokemonHabitats = habitats;
    });
  }

  getHabitatTranslation(habitat: string): string {
    var translatedHabitats = '';
    this.translate.get(`habitats.${habitat}`).subscribe((translation) => {
      translatedHabitats = translation;
    });
    return translatedHabitats || habitat;
  }

  onSearch(): void {
    this.page = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.pokemons;

    if (this.searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedType) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some((type: any) => type.type.name === this.selectedType)
      );
    }

    if (this.selectedHabitat) {
      filtered = filtered.filter(pokemon =>
        pokemon.habitat && pokemon.habitat === this.selectedHabitat
      );
    }

    this.filteredPokemons = filtered;
    this.totalPages = Math.ceil(this.filteredPokemons.length / this.pageSize);
    this.updatePagination();
  }

  updatePagination(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPokemons = this.filteredPokemons.slice(start, end);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePagination();
    }
  }

  translateStat(statName: string): string {
    var translatedStat = '';
    this.translate.get(`stats.${statName}`).subscribe((res: string) => {
      translatedStat = res;
    });
    return translatedStat;
  }


  selectPokemon(pokemon: any): void {
    const types = pokemon.types.map((type: any) => type.type.name);
    const habitat = pokemon.habitat || 'desconhecido';

    const stats = pokemon.stats.map((stat: any) => ({
      name: this.translateStat(stat.stat.name),
      baseStat: stat.base_stat
    }));

    this.dialog.open(PokemonDetailComponent, {
      data: {
        pokemon: pokemon,
        types: types,
        habitat: this.getHabitatTranslation(habitat),
        stats: stats
      }
    });
  }
}
