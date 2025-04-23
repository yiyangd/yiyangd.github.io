import Navbar from "./components/Navbar";
import NoteCard from "./components/NoteCard";

const notes = [
  {
    title: "统计学习笔记",
    englishTitle: "Statistical Learning Notes",
    totalLectures: 12,
    image: "/images/stats.jpg",
    href: "/notes/statistical-learning",
  },
  {
    title: "实分析笔记",
    englishTitle: "Real Analysis Notes",
    totalLectures: 15,
    image: "/images/math.jpg",
    href: "/notes/real-analysis",
  },
  {
    title: "概率论笔记",
    englishTitle: "Probability Theory Notes",
    totalLectures: 8,
    image: "/images/probability.jpg",
    href: "/notes/probability",
  },
  {
    title: "算法笔记",
    englishTitle: "Algorithms Notes",
    totalLectures: 20,
    image: "/images/algorithms.jpg",
    href: "/notes/algorithms",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4">
        <div className="pt-36 pb-8">
          <div className="grid gap-4">
            {notes.map((note, index) => (
              <NoteCard key={index} {...note} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
