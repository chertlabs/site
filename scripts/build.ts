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
console.log(`built ${ROUTES.length} routes → ${dist}`);
