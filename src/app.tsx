import { useEffect, useState, type ReactNode } from "react";
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
const NOISE = "чжшщэюяbdfkrtx#%";
const LOCK = [7, 10, 13, 16, 19];
const DONE = LOCK[LOCK.length - 1];

function glyph(i: number, tick: number): string {
  if (tick < 0) return FROM[i];
  if (tick >= LOCK[i]) return TO[i];
  if (i === 1 && tick < 2) return "";
  return NOISE[(tick * 7 + i * 5) % NOISE.length];
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
      className="m-0 mb-10 flex flex-wrap items-baseline gap-x-[0.35em] text-[clamp(44px,12vw,104px)] leading-none font-bold tracking-[-0.04em]"
      aria-label="chert labs"
    >
      <span
        className="whitespace-nowrap bg-[linear-gradient(135deg,#d58a48_20%,#2c3b72_85%)] bg-clip-text text-transparent"
        aria-hidden="true"
      >
        {TO.map((_, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom transition-[max-width] duration-300 ease-out"
            style={{ maxWidth: i === 1 && tick < 1 ? 0 : "1ch" }}
          >
            {glyph(i, tick) || "\u00a0"}
          </span>
        ))}
      </span>
      <span className="text-neutral-600" aria-hidden="true">
        labs
      </span>
    </h1>
  );
}

function Home() {
  return (
    <>
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

const notFound = (
  <Shell title="chertlabs / 404">
    <Prompt>cd .</Prompt>
    <div className="pl-[2ch] space-y-2">
      <p className="m-0">bash: no such file or directory</p>
      <p className="m-0">
        <a className={LINK} href="/">
          cd ~
        </a>
      </p>
    </div>
  </Shell>
);

export function App({ path }: { path?: string }) {
  return <MoonshineRouter routes={routes} path={path} fallback={notFound} />;
}
