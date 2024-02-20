import { useState } from "react";
import { ICard, ColumnTypes } from "../utils/types";
import AddCard from "./AddCard"
import DropIndicator from "./DropIndicator"
import Card from "./Card";

type ColumnProps = {
  title: string,
  headingColor: string,
  column: ColumnTypes,
  cards: ICard[],
  setCards: (value: ICard[] | ((prevState: ICard[]) => ICard[])) => void,
}

const Column = ({title, headingColor, column, cards, setCards}: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const highlightIndicator = (e: React.MouseEvent) => {
    const indicators = getIndicators() as HTMLElement[];
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const clearHighlights = (elements?: HTMLElement[]) => {
    const indicators = elements || getIndicators() as HTMLElement[];

    indicators.forEach((element: HTMLElement) => {
      element.style.opacity = "0";
    });
  };

  const getNearestIndicator = (e: { clientY: number; }, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50
    const element = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child};
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length -1]
      }
    );
    return element;
  };

  const handleDragState = (e:React.MouseEvent, card: ICard) => {
    console.log(e);
    console.log(card);
    // if (e instanceof React.DragEvent) {
      (e as React.DragEvent).dataTransfer.setData("cardId", card.id)
    // }
    
  };

  // const handleDragState = (card: Card) => (e:React.MouseEvent<Element, MouseEvent>) => {
  //   console.log(e);
  //   console.log(card);
  //   // if (e instanceof React.DragEvent) {
  //     (e as React.DragEvent).dataTransfer.setData("cardId", card.id)
  //   // }
    
  // };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };
  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData("cardId");
    const indicators = getIndicators() as HTMLElement[];
    const { element } = getNearestIndicator(e, indicators)
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      // I suggest to check the predicate :)
      let cardToTransfer = copy.find((c) => c.id === cardId);

      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column};

      // this creates a copy of only one column, where the data was dragged to
      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        // here you add your dragged card into the new column
        copy.push(cardToTransfer)
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      // here you reset the cards state with the "copy" (check what's inside :))
      setCards(copy);
    }
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className='w-56 shrink-8'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className={`font-medium ${headingColor}`}>
          {title}
        </h3>
        <span className='rounded text-sm text text-neutral-400'>
          {filteredCards.length}
        </span>
      </div>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`h-full w-full transition-colors ${
        active ? "bg-neutral-800/50" : "bg-neutral-800/0"
      }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragState={handleDragState}/>;
        })}
        <DropIndicator beforeId='-1' column={column}/>
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

export default Column;