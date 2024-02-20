import { motion } from "framer-motion";
import DropIndicator from "./DropIndicator"
import { ICard } from "../utils/types";

interface CardProps extends ICard {
  handleDragState: (e:React.MouseEvent, card: ICard) => void
}

const Card = ({ id, title, column, handleDragState }: CardProps) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column}/>
      <motion.div  
        layout
        layoutId={id}
        draggable="true"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDragStart={(e: any) => handleDragState(e, {title, id, column})}
        className='cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing'
      >
        <p className='text-sm text-neutral-100'>{title}</p>
      </motion.div>
    </>
  );
};

export default Card;