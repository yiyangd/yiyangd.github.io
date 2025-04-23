import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yiyang Dong's STEM STUDY SPACE",
  description: "A personal study space for STEM subjects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-gray-50">
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
