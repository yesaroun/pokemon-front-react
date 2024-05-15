import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Loading } from "../../assets/Loading.jsx";
import { LessThan } from "../../assets/LessThan.jsx";
import { ArrowLeft } from "../../assets/ArrowLeft.jsx";
import { GreaterThan } from "../../assets/GreaterThan.jsx";
import { Balance } from "../../assets/Balance.jsx";
import { Vector } from "../../assets/Vector.jsx";
import Type from "../../components/Type.jsx";
import BaseStat from "../../components/BaseStat.jsx";
import DamageModal from "../../components/DamageModal.jsx";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();
  const pokemonId = params.id;
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/";

  useEffect(() => {
    fetchPokemonData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPokemonData(params.id);
  }, [params]);

  async function fetchPokemonData() {
    const url = `${baseUrl}${pokemonId}`;
    try {
      const { data: pokemonData } = await axios.get(url);

      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities, sprites } = pokemonData;
        const nextAndPreviousPokemon = await getNextAndPreviousPokemon(id);

        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url);
            return type.data.damage_relations;
          }),
        );

        const formattedPokemonData = {
          id,
          name,
          types: types.map(type => type.type.name),
          weight: weight / 10,
          height: height / 10,
          stats: formatPokemonStats(stats),
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          DamageRelations,
          sprites: formatPokemonSprites(sprites),
        };
        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const formatPokemonSprites = (sprites) => {
    const newSprites = { ...sprites };

    // 객체의 프로퍼티의 값이 string이 아닌 것은 해당 프로퍼티 다 지우기
    Object.keys(newSprites).forEach(key => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });

    return Object.values(newSprites);
  };

  const formatPokemonAbilities = abilities =>
    abilities.filter((_, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));

  const formatPokemonStats = ([
                                statHP,
                                statATK,
                                statDEP,
                                statSATK,
                                statSDEP,
                                statSPD,
                              ]) => [
    { name: "Hit Points", baseState: statHP.base_stat },
    { name: "Attack", baseState: statATK.base_stat },
    { name: "Defense", baseState: statDEP.base_stat },
    { name: "Special Attack", baseState: statSATK.base_stat },
    { name: "Special Defense", baseState: statSDEP.base_stat },
    { name: "Speed", baseState: statSPD.base_stat },
  ];


  /**
   * prev와 next pokemon의 이름을 반환하는 함수
   *
   * @param id - pokemon id
   * @returns {Promise<{next: next pokemon name, previous: previous pokemon name}>}
   */
  async function getNextAndPreviousPokemon(id) {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;
    // prev와 next pokeon의 정보를 알 수 있는 url을 가져오기 위해 요청을 보냄
    const { data: pokemonData } = await axios.get(urlPokemon);
    // pokemonData에 pokemon url이 담김

    const nextResponse = pokemonData.next && (await axios.get(pokemonData?.next));
    const previousResponse = pokemonData.previous && (await axios.get(pokemonData?.previous));
    // pokemon 데이터를 url을 통해 다 가져옴

    return {
      next: nextResponse?.data.results?.[0]?.name,
      previous: previousResponse?.data.results?.[0]?.name,
    };
  }

  if (isLoading) return (
    <div className={`absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50`}>
      <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
    </div>
  );

  if (!isLoading && !pokemon) {
    return (<div>Not Found...</div>);
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  return (
    <article className="flex return items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >

        {pokemon.previous && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
            aria-label={`Previous pokemon`}
            to={`/pokemon/${pokemon.previous}`}
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}
        {pokemon.next && (
          <Link
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
            aria-label={`Next pokemon`}
            to={`/pokemon/${pokemon.next}`}
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}

        <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1">
              <Link aria-label="Go to Pokedex" to="/">
                <ArrowLeft className="w-6 h-8 text-zinc-200" />
              </Link>
              <h1 className="text-zinc-200 font-bold text-xl capitalize">
                {pokemon.name.replaceAll("-", " ")}
              </h1>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, "00")}
            </div>
          </div>
          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width="100%"
              height="auto"
              loading="lazy"
              alt={pokemon.name.replaceAll("-", " ")}
              className={`object-contain h-full`}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>
        <section
          className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* 포켓몬 타입 */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            정보
          </h2>

          <div className="flex w-full items-center justify-between max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Height</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Moves</h4>
              {pokemon.abilities.map((e, i) => (
                <div key={e} className="text-[0.5rem] text-zinc-100 capitalize">{e}</div>
              ))}
            </div>
          </div>

          <h2 className={`text-base font-semibold ${text}`}>
            기본 능력치
          </h2>
          <div className="w-full">
            <table>
              <tbody>
              {pokemon.stats.map((stat) => (
                <BaseStat
                  key={stat.name}
                  valueStat={stat.baseState}
                  nameStat={stat.name}
                  type={pokemon.types[0]}
                />
              ))}
              </tbody>
            </table>
          </div>
          <div className="flex my-8 flex-wrap justify-center">
            {pokemon.sprites.map((spriteUrl) => (
              <img src={spriteUrl} alt="sprite" key={spriteUrl} />
            ))}
          </div>
        </section>
      </div>
      {isModalOpen ?
        <DamageModal damages={pokemon.DamageRelations} setIsModalOpen={setIsModalOpen} />
        : null
      }
    </article>
  )
    ;
};

export default DetailPage;