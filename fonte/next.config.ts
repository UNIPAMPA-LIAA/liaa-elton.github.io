import type { NextConfig } from "next";

// O site é publicado no GitHub Pages em
// https://unipampa-liaa.github.io/liaa-elton.github.io/ (repositório dentro da
// organização UNIPAMPA-LIAA), então tudo vive sob esse subcaminho.
const basePath = "/liaa-elton.github.io";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
