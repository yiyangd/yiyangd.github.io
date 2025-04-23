import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                Yiyang Dong&apos;s
              </span>
              <span className="text-sm font-medium text-gray-600">
                STEM STUDY SPACE
              </span>
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Category navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-8 py-3">
              <Link
                href="/"
                className="flex-shrink-0 text-orange-500 font-medium"
              >
                全部笔记
              </Link>
              <Link
                href="/statistics"
                className="flex-shrink-0 text-gray-600 hover:text-orange-500"
              >
                统计
              </Link>
              <Link
                href="/math"
                className="flex-shrink-0 text-gray-600 hover:text-orange-500"
              >
                数学
              </Link>
              <Link
                href="/computer-science"
                className="flex-shrink-0 text-gray-600 hover:text-orange-500"
              >
                计算机
              </Link>
              <Link
                href="/robotics"
                className="flex-shrink-0 text-gray-600 hover:text-orange-500"
              >
                机器人
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
