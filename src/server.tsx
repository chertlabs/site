import { join } from "node:path";
import {
  createMoonshineServer,
  definePage,
} from "@tschk/moonshine-waku/server";
import { ROUTES } from "./app";
import { buildClient, readStyles } from "./bundle";
import { renderDocument } from "./document";

const outdir = join(import.meta.dir, "..", ".out");
await buildClient(outdir, false);

const html = (body: string, status = 200) =>
  new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });

const pages = Object.fromEntries(
  ROUTES.map((r) => [
    r.path,
    definePage({
      render: async () => html(renderDocument(r.path, await readStyles())),
    }),
  ]),
);

const envPort = Number(process.env.PORT);
const server = createMoonshineServer({
  port: Number.isInteger(envPort) && envPort > 0 ? envPort : 3000,
  staticDir: outdir,
  pages,
  notFound: async (req) =>
    html(renderDocument(req.pathname, await readStyles()), 404),
});

server.listen();
console.log(`chertlabs → http://localhost:${server.port}`);
