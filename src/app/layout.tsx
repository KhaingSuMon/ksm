import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "✨ Khaing Su Mon の魔法のポートフォリオ",
  description:
    "日本で冒険中のミャンマー出身IT魔法使い！コードと文化の橋渡し役、ラーメンと抹茶をこよなく愛する冒険者のワクワクする世界へようこそ！",
  openGraph: {
    title: "✨ Khaing Su Mon の魔法のポートフォリオ",
    description: "テクノロジーと文化の冒険、始まります！",
    images: [
      {
        url: "../assets/ogImage.jpg",
        width: 1200,
        height: 630,
        alt: "Khaing Su Mon - IT魔法使いの冒険日記",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "✨ Khaing Su Mon の魔法のポートフォリオ",
    description: "ミャンマーから日本へ、コードと文化の架け橋になる冒険",
    images: ["../assets/ogImage.jpg"],
  },
  keywords: [
    "Khaing Su Mon",
    "khaing su mon",
    "Khaing SuMon",
    "カイン・スー・モン",
    "ポートフォリオ",
    "ソフトウェア開発者",
    "ミャンマー出身",
    "日本在住",
    "多文化エンジニア",
    "国際的IT人材",
    "テクノロジー",
    "ウェブ開発",
  ],
  colorScheme: "light",
  themeColor: "#f9a8d4",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
