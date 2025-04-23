"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import NoteCard from "./components/NoteCard";
import { Note, NoteCategory } from "./types/note";

const notes: Note[] = [
  // 统计类笔记
  {
    title: "统计学习笔记",
    englishTitle: "Statistical Learning Notes",
    totalLectures: 12,
    image: "/images/stats.jpg",
    href: "/notes/statistical-learning",
    category: "statistics",
  },
  {
    title: "概率论笔记",
    englishTitle: "Probability Theory Notes",
    totalLectures: 8,
    image: "/images/probability.jpg",
    href: "/notes/probability",
    category: "statistics",
  },
  {
    title: "随机过程笔记",
    englishTitle: "Stochastic Process Notes",
    totalLectures: 10,
    image: "/images/stochastic.jpg",
    href: "/notes/stochastic-process",
    category: "statistics",
  },

  // 数学类笔记
  {
    title: "实分析笔记",
    englishTitle: "Real Analysis Notes",
    totalLectures: 15,
    image: "/images/real-analysis.jpg",
    href: "/notes/real-analysis",
    category: "math",
  },
  {
    title: "线性代数笔记",
    englishTitle: "Linear Algebra Notes",
    totalLectures: 20,
    image: "/images/linear-algebra.jpg",
    href: "/notes/linear-algebra",
    category: "math",
  },
  {
    title: "离散数学笔记",
    englishTitle: "Discrete Mathematics Notes",
    totalLectures: 18,
    image: "/images/discrete-math.jpg",
    href: "/notes/discrete-math",
    category: "math",
  },
  {
    title: "泛函分析笔记",
    englishTitle: "Functional Analysis Notes",
    totalLectures: 16,
    image: "/images/functional-analysis.jpg",
    href: "/notes/functional-analysis",
    category: "math",
  },

  // 计算机类笔记
  {
    title: "算法笔记",
    englishTitle: "Algorithms Notes",
    totalLectures: 25,
    image: "/images/algorithms.jpg",
    href: "/notes/algorithms",
    category: "computer",
  },
  {
    title: "数据结构笔记",
    englishTitle: "Data Structures Notes",
    totalLectures: 22,
    image: "/images/data-structures.jpg",
    href: "/notes/data-structures",
    category: "computer",
  },

  // 机器人类笔记
  {
    title: "Robotics笔记",
    englishTitle: "Robotics Notes",
    totalLectures: 14,
    image: "/images/robotics.jpg",
    href: "/notes/robotics",
    category: "robotics",
  },
  {
    title: "深度传感器笔记",
    englishTitle: "Depth Sensor Notes",
    totalLectures: 8,
    image: "/images/depth-sensor.jpg",
    href: "/notes/depth-sensor",
    category: "robotics",
  },
];

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState<NoteCategory>("all");

  const filteredNotes =
    currentCategory === "all"
      ? notes
      : notes.filter((note) => note.category === currentCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentCategory={currentCategory}
        onCategoryChange={setCurrentCategory}
      />
      <main className="max-w-screen-xl mx-auto px-4">
        <div className="pt-32 pb-8">
          <div className="grid gap-3">
            {filteredNotes.map((note, index) => (
              <NoteCard key={index} {...note} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
