import { renderToString } from "react-dom/server";
import { App, ROUTES } from "./app";

const DESCRIPTION =
  "Chert Labs is an experimental product lab from Chert: games and apps that live in FaceTime and iMessage, sold direct to people.";

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderDocument(path: string, css: string): string {
  const route = ROUTES.find((r) => r.path === path);
  const title = route?.title ?? "chertlabs / 404";
  const body = renderToString(<App path={path} />);
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(DESCRIPTION)}">`,
    '<meta name="color-scheme" content="dark">',
    '<meta name="theme-color" content="#000000">',
    `<style>${css}</style>`,
    "<noscript><style>.ty{visibility:visible!important}</style></noscript>",
    "</head>",
    "<body>",
    `<div id="root">${body}</div>`,
    '<script type="module" src="/client.js"></script>',
    "</body>",
    "</html>",
  ].join("");
}
