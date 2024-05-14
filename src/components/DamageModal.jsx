import DamageRelations from "./DamageRelations.jsx";
import { useRef } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside.jsx";

const DamageModal = ({ damages, setIsModalOpen }) => {
  const ref = useRef();
  useOnClickOutside(ref, () => setIsModalOpen(false));

  return (
    <div className="flex items-center justify-center z-40 fixed left-0 bottom-0 w-full h-full bg-gray-800">
      <div className="modal bg-white rounded-lg w-1/2" ref={ref}>
        <div className="flex flex-col items-start p-4">
          <div className="flex items-center w-full justify-between">
            <div className="text-gray-900 font-medium text-lg">데미지 관계</div>
            <span
              className="text-gray-900 font-medium text-lg cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              X
            </span>
          </div>
          <DamageRelations
            damages={damages}
          />
        </div>
      </div>
    </div>
  );
};

export default DamageModal;