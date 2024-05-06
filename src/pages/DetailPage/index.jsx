import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
        const { name, id, types, weight, height, stats, abilities } = pokemonData;
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
          weight: weight / 10,
          height: height / 10,
          previous: nextAndPreviousPokemon.previous,
          next: nextAndPreviousPokemon.next,
          abilities: formatPokemonAbilities(abilities),
          DamageRelations,
        };
        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
    { name: "Attack", baseState: statATK.base_state },
    { name: "Defense", baseState: statDEP.base_state },
    { name: "Special Attack", baseState: statSATK.base_state },
    { name: "Special Defense", baseState: statSDEP.base_state },
    { name: "Speed", baseState: statSPD.base_state },
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

  if (isLoading) return <div>...loading</div>;

  return (
    <div>DetailPage</div>
  );
};

export default DetailPage;