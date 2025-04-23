import Image from "next/image";
import Link from "next/link";

interface NoteCardProps {
  title: string;
  englishTitle: string;
  totalLectures: number;
  image: string;
  href: string;
}

export default function NoteCard({
  title,
  englishTitle,
  totalLectures,
  image,
  href,
}: NoteCardProps) {
  return (
    <Link href={href} className="block">
      <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="text-base font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-2">{englishTitle}</p>
          <p className="text-xs text-gray-400">已更新 {totalLectures} 讲</p>
        </div>
      </div>
    </Link>
  );
}
