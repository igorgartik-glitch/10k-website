import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Oswald({
  variable: "--font-display-family",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const sansFont = Inter({
  variable: "--font-sans-family",
  subsets: ["latin", "cyrillic"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VERTEX — инфраструктура для AI-инференса",
  description:
    "Технологичный лендинг с 3D-сценой, управляемой скроллом: ядро платформы вращается, распадается на частицы и собирается снова.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} h-full`}
    >
      <body className="min-h-full bg-ink text-paper antialiased">{children}</body>
    </html>
  );
}
