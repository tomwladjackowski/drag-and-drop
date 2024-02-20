import { useState } from 'react'
import { FaFire } from 'react-icons/fa'
import { FiPlus, FiTrash } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Column } from './Column';

type ColumnTypes = "backlog" | "todo" | "doing" | "done";

export interface Card {
  title: string,
  id: string,
  column: ColumnTypes,
}
// type Cards = Array<Card>;

const NotionKanban = () => {
  return (
    <div className='h-screen w-full bg-neutral-900 text-neutral-500'>
      <Board />
    </div>
  );
};

export default NotionKanban

const Board = () => {
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS)
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

export type ColumnProps = {
  title: string,
  headingColor: string,
  column: ColumnTypes,
  cards: Card[],
  setCards: (value: Card[] | ((prevState: Card[]) => Card[])) => void,
}

interface CardProps extends Card {
  handleDragState: (e:React.MouseEvent, card: Card) => void
}

export const Card = ({ id, title, column, handleDragState }: CardProps) => {
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

type DropIndicatorProps = {
  beforeId: string,
  column: ColumnTypes
}

export const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className='my-0.5 h-0.5 w-full bg-violet-400 opacity-0'
    >
    </div>
  );
};


type DeleteSectionProps = {
  setCards: (value: Card[] | ((prevState: Card[]) => Card[])) => void,
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

type AddCardProps = {
  column: ColumnTypes,
  setCards: (value: Card[] | ((prevState: Card[]) => Card[])) => void
}

export const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const newCard: Card = {
      column,
      title: text.trim(),
      id: Math.random().toString()
    };

    setCards((previousState: Card[]) => {
      const result: Card[] = [...previousState, newCard]
      return result;
    })
    setAdding(false)
  }
  return (
    <>
      {adding ? (
        <motion.form 
          layout
          onSubmit={handleSubmit}
        >
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder='Add new task...'
            className='w-full rounded border border-violet-400 bg-violet-400/20 p-3
            text-sm text-neutral-50 placeholder-violet-300 focus:outline-0'
          />
          <div className='mt-1.5 flex items-center justify-end gap-1.5'>
            <button
              onClick={() => setAdding(false)}
              className='px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50'
            >
              Close
            </button>
            <button
              type='submit'
              className='flex items-center px-3 py-1.5 text-xs bg-neutral-50 text-neutral-950 
              transition-colors hover:bg-neutral-300'
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
        ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className='flex w-full items-center gap-1.5 px-3 py-1.5 text-xs
          text-neutral-400 transition-colors hover:text-neutral-50'
        >
          <span>Add Cards</span>
          <FiPlus />
        </motion.button>
        )}
    </>
  );
};

const DEFAULT_CARDS: Card[] = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];