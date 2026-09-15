import { defineConfig } from "vite";

const PROJECT_PAGES_BASE = "/gpmlike/";

function withTrailingSlash(value: string): string {
  return value.endsWith("/") ? value : `${value}/`;
}

/**
 * Project Pages: https://progh2.github.io/gpmlike/
 * Override with VITE_BASE=/ for a user/org site, or any other prefix.
 */
function resolveBase(command: "build" | "serve", mode: string): string {
  if (process.env.VITE_BASE) {
    return withTrailingSlash(process.env.VITE_BASE);
  }

  if (process.env.GITHUB_ACTIONS === "true") {
    const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "gpmlike";
    const owner = process.env.GITHUB_REPOSITORY_OWNER ?? "";
    if (repo === `${owner}.github.io`) {
      return "/";
    }
    return `/${repo}/`;
  }

  // `vite build` and `vite preview` must share `/gpmlike/`; `npm run dev` stays `/`.
  return command === "build" || mode === "production" ? PROJECT_PAGES_BASE : "/";
}

export default defineConfig(({ command, mode }) => ({
  base: resolveBase(command, mode),
}));
