export type NoteCategory =
  | "all"
  | "statistics"
  | "math"
  | "computer"
  | "robotics";

export interface Note {
  title: string;
  englishTitle: string;
  totalLectures: number;
  image: string;
  href: string;
  category: NoteCategory;
}
