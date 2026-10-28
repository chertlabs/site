import { createGenerator } from "@unocss/core";
import presetWind4 from "@unocss/preset-wind4";
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

const uno = await createGenerator({
  presets: [presetWind4()],
  preflights: [
    {
      getCSS: () =>
        "html,body{margin:0;background:#000;color:#fff}::selection{background:#fff;color:#000}@keyframes blink{50%{opacity:0}}",
    },
  ],
});

export async function readStyles(): Promise<string> {
  const sources = await Promise.all(
    ["app.tsx", "document.tsx"].map((f) =>
      Bun.file(new URL(`./${f}`, import.meta.url)).text(),
    ),
  );
  const { css } = await uno.generate(sources.join("\n"), { minify: true });
  return css;
}
