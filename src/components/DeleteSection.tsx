import { useState } from "react";
import { FaFire } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { ICard } from "../utils/types";

type DeleteSectionProps = {
  setCards: (value: ICard[] | ((prevState: ICard[]) => ICard[])) => void,
}

const DeleteSection = ({ setCards }: DeleteSectionProps) => {
  const [active, setActive] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(true)
  };

  const handleDragLeave = () => {
    setActive(false)
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId")
    setCards((previousState) => {
      const result = previousState.filter((c) => c.id !== cardId)
      return result;
    });
    setActive(false);
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragEnd}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl 
      ${active 
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className='animate-bounce' /> : <FiTrash />}
    </div>
  );
};

export default DeleteSection;