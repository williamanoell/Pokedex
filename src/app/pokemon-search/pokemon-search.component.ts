import { Component } from '@angular/core';

@Component({
  selector: 'pokemon-search',
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent {
  searchQuery: string = '';

  onSearch() {
    console.log('Procurando por:', this.searchQuery);
    // Implementar lógica de busca aqui
  }
}
