import { NoteCategory } from "../types/note";

interface NavbarProps {
  currentCategory: NoteCategory;
  onCategoryChange: (category: NoteCategory) => void;
}

export default function Navbar({
  currentCategory,
  onCategoryChange,
}: NavbarProps) {
  const categories = [
    { id: "all" as const, name: "全部笔记" },
    { id: "statistics" as const, name: "统计" },
    { id: "math" as const, name: "数学" },
    { id: "computer" as const, name: "计算机" },
    { id: "robotics" as const, name: "机器人" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Top navigation */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Yiyang Dong&apos;s
              </span>
              <span className="text-sm font-medium text-gray-600">
                STEM STUDY SPACE
              </span>
            </div>
            <a
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </a>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8 py-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`text-sm font-medium whitespace-nowrap ${
                    currentCategory === category.id
                      ? "text-orange-500"
                      : "text-gray-600 hover:text-orange-500"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
