import type { NextConfig } from "next";

// GITHUB_PAGES_EXPORT=true npm run build производит статический экспорт,
// смонтированный на /10k-website/icesphere/ (GitHub Pages subpath этого
// репозитория). NEXT_PUBLIC_BASE_PATH пробрасывается в клиентский код тем же
// значением — хардкодные пути к public/ (см. Ground.tsx) собираются через
// него, потому что basePath у Next.js переписывает только _next/ и next/image,
// а не строковые пути, которые сами передаём в useTexture. Обычный
// `npm run dev` / `npm run build` остаются на нормальном роутинге без префикса.
const isGithubPagesExport = process.env.GITHUB_PAGES_EXPORT === "true";
const basePath = "/10k-website/icesphere";

const nextConfig: NextConfig = {
  ...(isGithubPagesExport
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPagesExport ? basePath : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
