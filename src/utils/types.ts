export type ColumnTypes = "backlog" | "todo" | "doing" | "done";

export interface ICard {
  title: string,
  id: string,
  column: ColumnTypes,
}