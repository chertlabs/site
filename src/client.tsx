import { useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "./app";

function Hydrated({ initial }: { initial: string }) {
  const [path, setPath] = useState<string | undefined>(initial);
  useEffect(() => setPath(undefined), []);
  return <App path={path} />;
}

hydrateRoot(
  document.getElementById("root")!,
  <Hydrated initial={location.pathname.replace(/\/+$/, "") || "/"} />,
);
