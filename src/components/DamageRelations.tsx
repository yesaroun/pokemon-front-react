import React, { useEffect, useState } from "react";
import Type from "./Type";
import { DamageRelations as DamageRelationsProps } from "../types/DamageRelationOfPokemonTypes";
import { Damage, DamageFromAndTo, SeparateDamages } from "../types/SeparateDamageRelations";

interface DamageModalProps {
  damages: DamageRelationsProps[];
}

interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageModalProps) => {

  const [damagePokeonForm, setDamagePokeonForm] = useState<SeparateDamages>({});

  useEffect(() => {
    const arrayDamage = damages.map((damage) => seperateObjectBetweenToAndFrom(damage));

    if (arrayDamage.length === 2) {
      // 합치는 부분
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokeonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      setDamagePokeonForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);

  const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    } as DamageFromAndTo;
  };

  const reduceDuplicateValues = (props: SeparateDamages) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4",
      no_damage: "0x",
    };

    return Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName as keyof typeof props;

        const verifiedValue = filterForUniqueValues(
          value,
          duplicateValues[key],
        );

        return (acc = { [keyName]: verifiedValue, ...acc });
      }, {});
  };

  const filterForUniqueValues = (valueForFiltering: Damage[], damageValue: string) => {
    const initialArray: Damage[] = [];

    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;
      const filterACC = acc.filter((a) => a.name !== name);

      return filterACC.length === acc.length
        ? (acc = [currentValue, ...acc])
        : (acc = [{ damageValue: damageValue, name, url }, ...filterACC]);
    }, initialArray);
  };

  const joinObjects = (props: DamageFromAndTo[], string: string) => {
    const key = string as keyof typeof props[0];
    const firstArrayValue = props[0][key];
    const secondArrayValue = props[1][key];
    const result = Object.entries(secondArrayValue)
      .reduce((acc, [keyName, value]: [string, Damage]) => {
        const key = keyName as keyof typeof firstArrayValue;
        // eslint-disable-next-line react/prop-types
        const result = firstArrayValue[key]?.concat(value);
        return (acc = { [keyName]: result, ...acc });
      }, {});
    return result;
  };

  const postDamageValue = (props: SeparateDamages): SeparateDamages => {
    const result = Object.entries(props)
      .reduce((acc, [keyName, value]) => {
        const key = keyName as keyof typeof props;
        const valuesOfKeyName = {
          double_damage: "2x",
          half_damage: "1/2x",
          no_damage: "0x",
        };

        return (acc = {
          [keyName]: value.map((i: Info[]) => ({
              damageValue: valuesOfKeyName[key],
              ...i,
            }),
          ),
          ...acc,
        });
      }, {});
    return result;
  };

  const seperateObjectBetweenToAndFrom = (damage: DamageRelationsProps): DamageFromAndTo => {
    const from = filterDamageRelations("_from", damage);
    // from으로 된 것들 필터링

    const to = filterDamageRelations("_to", damage);
    // to로 된 것들 필터링

    return { from, to };
  };

  const filterDamageRelations = (valueFilter: string, damage: DamageRelationsProps) => {
    const result: SeparateDamages = Object.entries(damage)
      .filter(([keyName, _]) => {
        // half_damage_from [{name: 'poison', url...}]

        // half_damage_from 에서 _from 포함하는 것만 진행
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [keyName, value]): SeparateDamages => {
        // {double_damage: Array(2)} (2) ['half_damage_to', Array(4)]
        const keyWithValueFilterRemove = keyName.replace(
          valueFilter,
          "",
        );
        // half_damage   _to 제거
        return (acc = { [keyWithValueFilterRemove]: value, ...acc });
        // {half_damage: Array(4), double_damage: Array(2)}
      }, {});

    return result;
  };

  return (
    <div className="flex gap-2 flex-col">
      {damagePokeonForm ? (
        <>
          {Object.entries(damagePokeonForm).map(
            ([keyName, value]: [string, Damage[]]) => {
              const key = keyName as keyof typeof damagePokeonForm;
              const ValuesOfKeyName = {
                double_damage: "Weak",
                half_damage: "Resistant",
                no_damage: "Immune",
              };
              return (
                <div key={key}>
                  <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                    {ValuesOfKeyName[key]}
                  </h3>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {value.length > 0 ? (
                      value.map(({ name, url, damageValue }) => {
                        return (
                          <Type
                            type={name}
                            key={url}
                            damageValue={damageValue}
                          />
                        );
                      })
                    ) : (
                      <Type type={"none"} key={"none"} />
                    )}
                  </div>
                </div>
              );
            },
          )}
        </>
      ) : <div></div>}
    </div>
  );
};

export default DamageRelations;