import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { ROUTES } from "../src/app";
import { buildClient, readStyles } from "../src/bundle";
import { renderDocument } from "../src/document";

const dist = join(import.meta.dir, "..", "dist");
await rm(dist, { recursive: true, force: true });
await buildClient(dist, true);

const css = await readStyles();
for (const route of ROUTES) {
  const dir = join(dist, route.path);
  await mkdir(dir, { recursive: true });
  await Bun.write(join(dir, "index.html"), renderDocument(route.path, css));
}
await Bun.write(join(dist, "404.html"), renderDocument("/404", css));
await Bun.write(
  join(dist, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://chertlabs.com/sitemap.xml\n",
);
await Bun.write(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${ROUTES.map((r) => `<url><loc>https://chertlabs.com${r.path}</loc></url>`).join("")}</urlset>\n`,
);
await Bun.write(
  join(dist, "favicon.svg"),
  Bun.file(join(import.meta.dir, "..", "public", "favicon.svg")),
);
console.log(`built ${ROUTES.length} routes → ${dist}`);
