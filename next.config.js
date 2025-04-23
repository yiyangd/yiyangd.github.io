/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 启用静态导出
  basePath: "/yiyangd.github.io", // 设置基本路径为你的仓库名
  images: {
    unoptimized: true, // GitHub Pages不支持Next.js的图片优化功能
  },
};

module.exports = nextConfig;
