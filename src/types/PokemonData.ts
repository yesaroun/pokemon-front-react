export interface PokemonData {
  count: number;
  next: string | null;
  previous: string | null;
  resultes: PokemonNameAndUrl[];
}

export interface PokemonNameAndUrl {
  name: string;
  url: string;
}