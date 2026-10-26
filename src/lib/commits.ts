import { useEffect, useState } from "react";
import { ghRepo } from "@/lib/github";

export type Commit = { sha: string; date: string };

// Snapshot of each repo's latest commit (Oct 2026). The live GitHub API refreshes it in the
// browser; this is the fallback when the API is rate-limited or offline.
const SNAPSHOT: Record<string, Commit> = {
  "chatGPT-clone": { sha: "1ffe359", date: "2023-05-30" },
  "teamschat-app": { sha: "2e9cfb6", date: "2023-06-14" },
  "Linkedin-clone": { sha: "38a3fba", date: "2024-03-05" },
  taskdone: { sha: "55214de", date: "2024-12-15" },
  ProdYis: { sha: "4456388", date: "2026-04-29" },
  "Workout-Application-Backend": { sha: "0570e14", date: "2022-12-30" },
  "react-dash": { sha: "6f4f046", date: "2024-04-06" },
  "spotify-clone": { sha: "adcf9a5", date: "2022-11-27" },
  "Bchain-H-T": { sha: "8a3388c", date: "2024-08-26" },
  "car-game": { sha: "fd715a8", date: "2022-12-22" },
};

const CACHE = "gh-latest-commits";

async function fetchLatest(repo: string): Promise<Commit> {
  const r = await fetch(`https://api.github.com/repos/${ghRepo(repo)}/commits?per_page=1`);
  if (!r.ok) throw new Error(String(r.status));
  const [c] = await r.json();
  return { sha: c.sha.slice(0, 7), date: c.commit.committer.date.slice(0, 10) };
}

export function useLatestCommits(all: string[]) {
  const repos = all.filter(Boolean); // live-only projects have no repo
  const [commits, setCommits] = useState<Record<string, Commit>>(() => {
    try {
      return { ...SNAPSHOT, ...JSON.parse(sessionStorage.getItem(CACHE) ?? "{}") };
    } catch {
      return SNAPSHOT;
    }
  });

  useEffect(() => {
    let alive = true;
    try {
      if (sessionStorage.getItem(CACHE)) return;
    } catch {}
    Promise.allSettled(repos.map(fetchLatest)).then((res) => {
      if (!alive) return;
      const fresh: Record<string, Commit> = {};
      res.forEach((r, i) => r.status === "fulfilled" && (fresh[repos[i]] = r.value));
      if (!Object.keys(fresh).length) return;
      setCommits((c) => ({ ...c, ...fresh }));
      try {
        sessionStorage.setItem(CACHE, JSON.stringify(fresh));
      } catch {}
    });
    return () => {
      alive = false;
    };
  }, [repos.join()]);

  return commits;
}

export const formatDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
