import { useEffect, useState, type ReactNode } from "react";
import { MoonshineRouter } from "@tschk/moonshine/router";
import { GLYPHS } from "./glyphs";
import { MARK } from "./mark";

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

const LINK =
  "text-white underline underline-offset-3 hover:bg-white hover:text-black hover:no-underline focus-visible:bg-white focus-visible:text-black focus-visible:outline-none";

function Prompt({ children }: { children: ReactNode }) {
  return (
    <p className="m-0">
      <span className="text-neutral-500" aria-hidden="true">
        chertlabs:~$
      </span>{" "}
      {children}
    </p>
  );
}

function Block({ cmd, children }: { cmd: string; children: ReactNode }) {
  return (
    <section className="mb-7" aria-label={cmd}>
      <Prompt>{cmd}</Prompt>
      <div className="pl-[2ch] space-y-2">{children}</div>
    </section>
  );
}

const FROM = ["ч", "", "е", "р", "т"];
const TO = ["c", "h", "e", "r", "t"];
const NOISE = ".:-=+*#%";
const LOCK = [7, 10, 13, 16, 19];
const DONE = LOCK[LOCK.length - 1];
const ROWS = GLYPHS.c.length;

function glyph(i: number, tick: number): string[] {
  if (tick < 0) return FROM[i] ? GLYPHS[FROM[i]] : GLYPHS[TO[i]];
  if (tick >= LOCK[i]) return GLYPHS[TO[i]];
  return GLYPHS[TO[i]].map((row, r) =>
    row.replace(
      /\S/g,
      (_, c: number) => NOISE[(tick * 7 + i * 5 + r * 3 + c) % NOISE.length],
    ),
  );
}

function Letter({ rows, width }: { rows: string[]; width: string | number }) {
  return (
    <span
      className="inline-block overflow-hidden whitespace-pre align-top transition-[max-width] duration-300 ease-out"
      style={{ maxWidth: width }}
    >
      {rows.map((row) => row.padEnd(7)).join("\n")}
    </span>
  );
}

function Wordmark() {
  const [tick, setTick] = useState(-1);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTick(DONE);
      return;
    }
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        setTick((t) => {
          if (t + 1 >= DONE) clearInterval(timer);
          return Math.min(t + 1, DONE);
        });
      }, 60);
    }, 900);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, []);
  return (
    <h1
      className="m-0 mb-10 text-[clamp(6px,1.9vw,13px)] leading-[1.05] font-bold select-none"
      aria-label="chert labs"
    >
      <pre className="m-0 overflow-hidden" aria-hidden="true">
        <span className="inline-block bg-[linear-gradient(170deg,#f2913d_25%,#26336a_85%)] bg-clip-text text-transparent">
          {TO.map((_, i) => (
            <Letter
              key={i}
              rows={glyph(i, tick)}
              width={i === 1 && tick < 1 ? 0 : "7ch"}
            />
          ))}
        </span>
        <span className="text-neutral-500">
          <Letter rows={Array(ROWS).fill("")} width="3ch" />
          {["l", "a", "b", "s"].map((c) => (
            <Letter
              key={c}
              rows={GLYPHS[c]}
              width={`${Math.max(...GLYPHS[c].map((r) => r.trimEnd().length)) + 1}ch`}
            />
          ))}
        </span>
      </pre>
    </h1>
  );
}

function Home() {
  return (
    <>
      <pre
        className="m-0 mb-6 overflow-hidden text-[clamp(6px,1.9vw,13px)] leading-[1.05] font-bold bg-[linear-gradient(170deg,#f2913d_30%,#26336a_75%)] bg-clip-text text-transparent select-none"
        aria-hidden="true"
      >
        {MARK}
      </pre>
      <Wordmark />
      <Block cmd="cat about">
        <p className="m-0">
          an experimental product lab from{" "}
          <a className={LINK} href="https://www.trychert.com">
            chert
          </a>
          .
        </p>
        <p className="m-0">
          we build games and apps that live inside facetime and imessage. no app
          to download: you text a number, or you call it.
        </p>
        <p className="m-0">
          direct to consumer. small, strange, and made by a few people.
        </p>
      </Block>
      <Block cmd="ls products/">
        <ul className="m-0 list-none p-0">
          {PRODUCTS.map(([name, what, url]) => (
            <li
              key={name}
              className="mb-2 grid grid-cols-1 sm:mb-0 sm:grid-cols-[14ch_1fr] sm:gap-[2ch]"
            >
              <span>
                {url ? (
                  <a className={LINK} href={url}>
                    {name}/
                  </a>
                ) : (
                  `${name}/`
                )}
              </span>
              <span>
                {what}
                {url ? null : <span className="text-neutral-500"> [soon]</span>}
              </span>
            </li>
          ))}
        </ul>
      </Block>
      <Block cmd="cat rules">
        <ol className="m-0 pl-[3ch]">
          {RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ol>
      </Block>
      <Block cmd="cat contact">
        <p className="m-0">
          platform <span className="text-neutral-500">→</span>{" "}
          <a className={LINK} href="https://www.trychert.com">
            trychert.com
          </a>
        </p>
        <p className="m-0">
          code <span className="text-neutral-500">→</span>{" "}
          <a className={LINK} href="https://github.com/chertlabs">
            github.com/chertlabs
          </a>
        </p>
      </Block>
      <Prompt>
        <span
          className="inline-block h-[1.15em] w-[1ch] bg-white align-text-bottom animate-[blink_1.1s_steps(1)_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
      </Prompt>
    </>
  );
}

function Shell({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return (
    <main className="mx-auto max-w-[78ch] px-4 pt-12 pb-24 font-mono text-[14px] leading-[1.6] antialiased sm:text-[15px]">
      {children}
    </main>
  );
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

const ELSEWHERE: Array<[string, string, string]> = [
  [
    "autophobia",
    "six friends who always text back",
    "https://autophobia.chertlabs.com",
  ],
  ["kyu", "someone who answers, honestly", "https://kyu.chertlabs.com"],
  ["strangers", "someone always picks up", "https://strangers.chertlabs.com"],
];

const BUBBLE = "m-0 max-w-[32ch] rounded-2xl px-3 py-1.5";

function Missing() {
  const [path, setPath] = useState("this page");
  const [stage, setStage] = useState(0);
  useEffect(() => {
    setPath(location.pathname);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage(5);
      return;
    }
    const timers = [1600, 2400, 3600, 5200, 6200].map((ms, i) =>
      setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <>
      <Block cmd={`facetime ${path}`}>
        <p className="m-0 text-neutral-500">
          {stage < 1 ? "calling…" : "no answer. 404."}
        </p>
      </Block>
      {stage >= 2 ? (
        <Block cmd={`imessage ${path}`}>
          <div className="flex flex-col items-end gap-1">
            <p className={`${BUBBLE} bg-[#0a84ff] text-white`}>hello?</p>
            <p className="m-0 text-xs text-[#ff453a]">
              {stage >= 3 ? "Not Delivered" : "Sending…"}
            </p>
          </div>
          {stage >= 4 ? (
            <div className="flex flex-col items-start gap-1">
              <p className={`${BUBBLE} bg-neutral-800 text-neutral-200`}>
                there's nothing here. there never was.
              </p>
              <p className="m-0 text-xs text-neutral-500">unknown</p>
            </div>
          ) : null}
        </Block>
      ) : null}
      {stage >= 5 ? (
        <Block cmd="ls ~/ --someone-who-answers">
          <ul className="m-0 list-none p-0">
            {ELSEWHERE.map(([name, what, url]) => (
              <li
                key={name}
                className="mb-2 grid grid-cols-1 sm:mb-0 sm:grid-cols-[14ch_1fr] sm:gap-[2ch]"
              >
                <a className={LINK} href={url}>
                  {name}/
                </a>
                <span>{what}</span>
              </li>
            ))}
          </ul>
          <p className="m-0">
            <a className={LINK} href="/">
              cd ~
            </a>
          </p>
        </Block>
      ) : null}
    </>
  );
}

const notFound = (
  <Shell title="chertlabs / 404">
    <Missing />
  </Shell>
);

export function App({ path }: { path?: string }) {
  return <MoonshineRouter routes={routes} path={path} fallback={notFound} />;
}
