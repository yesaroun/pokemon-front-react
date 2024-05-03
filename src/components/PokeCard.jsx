import { useEffect, useState } from "react";
import axios from "axios";

export default function PokeCard({ url, name }) {
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    fetchPokeDetailData(url);
  }, [url]);

  async function fetchPokeDetailData() {
    try {
      const response = await axios.get(url);
      const pokemonData = formatPokemonData(response.data);
      setPokemon(pokemonData);
    } catch (err) {
      console.error(err);
    }
  }

  function formatPokemonData(params) {
    const { id, types, name } = params;
    const PokeData = {
      id,
      name,
      type: types[0].type.name,
    };
    return PokeData;
  }

  console.log(pokemon);

  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  return (
    <>
      {pokemon &&
        <a
          aria-label={name}
          href={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >
          <div
            className={`${text} basis h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, "00")}
          </div>
          <div className={`w-full f-6 flex items-center justify-center`}>
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
            >
              <img src={img} alt={name} width="100%" className={`object-contain h-full`} />
            </div>
          </div>
          <div
            className={`${bg} basis h-[1.5rem] w-full text-xs text-zinc-100 font-medium flex items-center justify-center rounded-b-lg uppercase`}
          >
            {pokemon.name}
          </div>
        </a>
      }
    </>
  );
}