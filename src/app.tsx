import { useEffect, type ReactNode } from "react";
import { MoonshineRouter } from "@tschk/moonshine/router";

export const ROUTES = [{ path: "/", title: "chertlabs" }] as const;

const PRODUCTS: Array<[string, string, string | null]> = [
  [
    "autophobia",
    "a week-long psychological horror over text and facetime. six new friends. call any of them.",
    "https://autophobia.chertlabs.com",
  ],
  [
    "kyu",
    "someone to text. honestly. a companion that lives in your messages.",
    "https://kyu.chertlabs.com",
  ],
  [
    "strangers",
    "call a number on facetime. talk to a stranger.",
    "https://strangers.chertlabs.com",
  ],
  [
    "together",
    "group facetime, streamed and in sync: camera grid, broadcast, watch party.",
    null,
  ],
];

const RULES = [
  "you text first. we never message a number that hasn't messaged us.",
  "consent is asked for each thing, separately. stop always works.",
  "no app to install. no ads. no trackers.",
  "you pay us directly. you are the customer, not the product.",
];

function Prompt({ cmd }: { cmd: string }) {
  return (
    <p className="cmd">
      <span className="ps1" aria-hidden="true">
        chertlabs:~$
      </span>{" "}
      {cmd}
    </p>
  );
}

function Block({ cmd, children }: { cmd: string; children: ReactNode }) {
  return (
    <section aria-label={cmd}>
      <Prompt cmd={cmd} />
      <div className="out">{children}</div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Block cmd="cat about">
        <h1>chert labs</h1>
        <p>
          an experimental product lab from{" "}
          <a href="https://www.trychert.com">chert</a>.
        </p>
        <p>
          we build games and apps that live inside facetime and imessage. no app
          to download: you text a number, or you call it.
        </p>
        <p>direct to consumer. small, strange, and made by a few people.</p>
      </Block>
      <Block cmd="ls products/">
        <ul className="ls">
          {PRODUCTS.map(([name, what, url]) => (
            <li key={name}>
              <span className="name">
                {url ? <a href={url}>{name}/</a> : `${name}/`}
              </span>
              <span className="what">
                {what}
                {url ? null : <span className="dim"> [soon]</span>}
              </span>
            </li>
          ))}
        </ul>
      </Block>
      <Block cmd="cat rules">
        <ol className="rules">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </Block>
      <Block cmd="cat contact">
        <p>
          platform <span className="dim">→</span>{" "}
          <a href="https://www.trychert.com">trychert.com</a>
        </p>
        <p>
          code <span className="dim">→</span>{" "}
          <a href="https://github.com/chertlabs">github.com/chertlabs</a>
        </p>
      </Block>
      <p className="cmd">
        <span className="ps1" aria-hidden="true">
          chertlabs:~$
        </span>{" "}
        <span className="cursor" aria-hidden="true" />
      </p>
    </>
  );
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <main className="term">{children}</main>;
}

const routes = [
  {
    path: "/",
    element: (
      <Shell title="chertlabs">
        <Home />
      </Shell>
    ),
  },
];

const notFound = (
  <Shell title="chertlabs / 404">
    <Prompt cmd="cd ." />
    <div className="out">
      <p>bash: no such file or directory</p>
      <p>
        <a href="/">cd ~</a>
      </p>
    </div>
  </Shell>
);

export function App({ path }: { path?: string }) {
  return <MoonshineRouter routes={routes} path={path} fallback={notFound} />;
}
