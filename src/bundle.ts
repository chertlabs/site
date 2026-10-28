import { moonshineWakuPlugin } from "@tschk/moonshine-waku/aliases";

export async function buildClient(
  outdir: string,
  minify: boolean,
): Promise<void> {
  const result = await Bun.build({
    entrypoints: [new URL("./client.tsx", import.meta.url).pathname],
    outdir,
    target: "browser",
    format: "esm",
    minify,
    plugins: [moonshineWakuPlugin()],
    define: {
      "process.env.NODE_ENV": JSON.stringify(
        minify ? "production" : "development",
      ),
    },
  });
  if (!result.success) {
    throw new AggregateError(result.logs, "client build failed");
  }
}

export function readStyles(): Promise<string> {
  return Bun.file(new URL("./styles.css", import.meta.url)).text();
}
