import type { Metadata } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Unbounded({
  variable: "--font-display-family",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
});

const sansFont = Inter({
  variable: "--font-sans-family",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "LandMarka — приватная резиденция",
  description:
    "Кинематографичный пролёт камеры сквозь дом: от фасада до интерьеров и сада, управляемый скроллом.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${displayFont.variable} ${sansFont.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-cream antialiased">{children}</body>
    </html>
  );
}
