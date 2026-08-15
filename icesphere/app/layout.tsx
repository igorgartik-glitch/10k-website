import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Ледяная сфера — как устроена сцена",
  description:
    "Ледяная сфера из кирпичей парит над заснеженной равниной. Прокрутка ведёт камеру; переход открывает лендинг об устройстве сцены.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${sansFont.variable} ${monoFont.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink-1)] antialiased">
        {children}
      </body>
    </html>
  );
}
