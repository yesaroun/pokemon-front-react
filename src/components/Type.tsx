const Type = ({ type, damageValue }: { type: string, damageValue: string | null }) => {
  const bg = `bg-${type}`;

  return (
    <div
      className={`
        h-[1.5rem] py-1 px-3 rounded-2xl font-bold text-zinc-800 text-[0.625rem] 
        leading-[0.875rem] capitalize ${bg} flex gap-1 justify-center items-center
      `}
    >
      <span>{type}</span>
      {damageValue && (
        <span className="bg-zinc-200/40 p-[.125rem] rounded">
          {damageValue}
        </span>
      )}
    </div>
  );
};

export default Type;