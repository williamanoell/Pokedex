import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  pokemonTypes: string[] = [];
  pokemonHabitats: string[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  selectedHabitat: string = '';
  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  showFilters = false;
  isLoading = false;

  constructor(private pokemonService: PokemonService,
    private dialog: MatDialog) { }


  ngOnInit(): void {
    this.loadPokemons();
  }

  toggleFilterMenu() {
    this.showFilters = !this.showFilters;
    this.filteredPokemons = [];
    this.selectedType = '';
    this.selectedHabitat = '';

    if (this.showFilters == false)
      this.loadPokemons();
  }

  loadPokemons(): void {
    this.isLoading = true;
    this.pokemonService.getPokemons().subscribe((pokemons) => {
      this.pokemons = pokemons;
      this.pokemonTypes = this.getAllTypes(pokemons);
      this.getAllTHabitats();
      this.applyFilters();
      this.isLoading = false;
    })
  }

  getAllTypes(pokemons: any[]): string[] {
    const types = pokemons.flatMap(pokemon => pokemon.types.map((type: any) => type.type.name));
    return Array.from(new Set(types)); // Remove duplicatas
  }

  getAllTHabitats(): any {
    this.pokemonService.getPokemonHabitats().subscribe((habitats) => {
      this.pokemonHabitats = habitats;
    });
  }

  onSearch(): void {
    this.page = 1; // Reinicia para a primeira página ao buscar
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
      filtered = filtered.filter(pokemon => {
        return pokemon.habitat && pokemon.habitat === this.selectedHabitat;
      });
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

  selectPokemon(pokemon: any): void {
    const types = pokemon.types.map((type: any) => type.type.name).join(', ');
    const habitat = pokemon.habitat.name; // Obter habitat


    const stats = pokemon.stats.map((stat: any) => ({
      name: stat.stat.name,
      baseStat: stat.base_stat
    }));

    this.dialog.open(PokemonDetailComponent, {
      data: {
        pokemon: pokemon,
        types: types,
        habitat: habitat,
        stats: stats
      }
    });
  }
}
