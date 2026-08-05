import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import DemoBanner from "@/components/DemoBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "아트메이트 AI — 문화예술인 AI 개인 매니저",
  description:
    "프로필을 만들고, 섭외를 받고, 일정을 관리하세요. 나머지는 AI 매니저가 챙겨드립니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <DemoBanner />
        <Nav />
        <main className="flex-1">{children}</main>
        <div className="h-16 md:hidden" />
      </body>
    </html>
  );
}
