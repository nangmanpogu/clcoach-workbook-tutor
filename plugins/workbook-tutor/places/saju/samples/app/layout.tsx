import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  preload: false,
  variable: "--font-sans",
});
const serif = Noto_Serif_KR({
  weight: ["700", "900"],
  preload: false,
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "사주풀이",
  description: "생년월일시를 넣으면 사주 여덟 글자와 풀이를 보여 드려요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F1E6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
