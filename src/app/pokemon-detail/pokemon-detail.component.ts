import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PokemonDetailComponent>) { }

  // Exemplo de dados de Pokémon
  pokemonDetails = {
    id: 1,
    name: 'Bulbasaur',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    type: 'Grass/Poison',
    abilities: ['Overgrow', 'Chlorophyll'],
  };

  closeModal(): void {
    this.dialogRef.close();
  }
}
