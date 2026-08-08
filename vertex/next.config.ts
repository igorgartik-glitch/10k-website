import type { NextConfig } from "next";

// GITHUB_PAGES_EXPORT=true npm run build produces a static export rooted at
// /10k-website/vertex/ (this repo's GitHub Pages subpath). Plain `npm run dev` /
// `npm run build` stay on normal Next.js routing for local development.
const isGithubPagesExport = process.env.GITHUB_PAGES_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isGithubPagesExport
    ? {
        output: "export" as const,
        basePath: "/10k-website/vertex",
        trailingSlash: true,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
