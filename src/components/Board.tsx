import { useState, useEffect } from "react";
import Column from "./Column"
import DeleteSection from "./DeleteSection"
import DEFAULT_CARDS from "../utils/DefaultCards"
import { ICard } from "../utils/types";

const Board = () => { 
  const [cards, setCards] = useState<ICard[]>(DEFAULT_CARDS);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    hasChecked && localStorage.setItem("cards", JSON.stringify(cards));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards])

  useEffect(() => {
    const cardData = localStorage.getItem("cards");
    setCards(cardData ? JSON.parse(cardData): [])
    setHasChecked(true)
  }, [])
  return (
    <div className='flex h-full w-full gap-3 overflow-scroll p-12'>
      <Column
        title='Backlog'
        column='backlog'
        headingColor='text-neutral-500'
        cards={cards}
        setCards={setCards}
      />
      <Column
        title='TODO'
        column='todo'
        headingColor='text-yellow-200'
        cards={cards}
        setCards={setCards}
      />
      <Column
        title='In progress'
        column='doing'
        headingColor='text-blue-200'
        cards={cards}
        setCards={setCards}
      />
      <Column
        title='Complete'
        column='done'
        headingColor='text-emerald-200'
        cards={cards}
        setCards={setCards}
      />
      <DeleteSection setCards={setCards}/>
    </div>
  );
};

export default Board;