import Image from "next/image";
import { Note } from "../types/note";

type NoteCardProps = Note;

export default function NoteCard({
  title,
  englishTitle,
  totalLectures,
  image,
  href,
}: NoteCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <a href={href} className="block p-4">
        <div className="flex items-start space-x-4">
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 64px) 100vw, 64px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-gray-900 line-clamp-1">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-1">
              {englishTitle}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              已更新 {totalLectures} 讲
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
