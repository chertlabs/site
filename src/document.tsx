import { renderToString } from "react-dom/server";
import { App, ROUTES } from "./app";

const DESCRIPTION =
  "Chert Labs is an experimental product lab from Chert: games and apps that live in FaceTime and iMessage, sold direct to people.";

const ORIGIN = "https://chertlabs.com";

const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Chert Labs",
  alternateName: "chertlabs",
  url: ORIGIN,
  logo: `${ORIGIN}/favicon.svg`,
  description: DESCRIPTION,
  parentOrganization: {
    "@type": "Organization",
    name: "Chert",
    url: "https://www.trychert.com",
  },
  sameAs: ["https://github.com/chertlabs"],
};

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
    ...(route
      ? [
          `<link rel="canonical" href="${ORIGIN}${path}">`,
          '<meta property="og:type" content="website">',
          '<meta property="og:site_name" content="chertlabs">',
          `<meta property="og:url" content="${ORIGIN}${path}">`,
          `<meta property="og:title" content="${escape(title)}">`,
          `<meta property="og:description" content="${escape(DESCRIPTION)}">`,
          '<meta name="twitter:card" content="summary">',
          `<meta name="twitter:title" content="${escape(title)}">`,
          `<meta name="twitter:description" content="${escape(DESCRIPTION)}">`,
          `<script type="application/ld+json">${JSON.stringify(ORGANIZATION).replace(/</g, "\\u003c")}</script>`,
        ]
      : ['<meta name="robots" content="noindex">']),
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
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
