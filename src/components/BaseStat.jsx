import { useEffect, useRef } from "react";

const BaseStat = ({ type, nameStat, valueStat }) => {
  const bg = `bg-${type}`;

  const ref = useRef(null);

  useEffect(() => {
    const setValuesSet = ref.current;
    const calc = valueStat * (100 / 255);
    setValuesSet.style.width = calc + "%";
  }, []);

  return (
    <tr className="w-full text-white">
      <td className="sm:px-5">{nameStat}</td>
      <td className="px-2 sm:px-3">{valueStat}</td>
      <td>
        <div
          className={`flex items-start h-2 overflow-hidden w-full min-w-[10rem] rounded bg-gray-600`}
        >
          <div ref={ref} className={`h-3 ${bg}`}></div>
        </div>
      </td>
      <td className="px-2 sm:px-5">255</td>
    </tr>
  );
};

export default BaseStat;