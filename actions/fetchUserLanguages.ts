"use server";

/**
 * Fetches and aggregates language usage across a user's public repos.
 * Uses GitHub REST API: list repos, then get languages for each repo.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#2b7489",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#239120",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Vue: "#41b883",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Shell: "#89e051",
  SCSS: "#c6538c",
  Less: "#1d365d",
  Dart: "#00B4AB",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Lua: "#000080",
  Perl: "#0298c3",
  Scala: "#c22d40",
  "Objective-C": "#438eff",
  R: "#198CE7",
  TeX: "#3D6117",
  Markdown: "#083fa1",
  Dockerfile: "#384d54",
  YAML: "#cb171e",
  JSON: "#292929",
};

export interface LanguageStat {
  language: string;
  percentage: number;
  color: string;
}

async function getToken(): Promise<string> {
  const token = process.env.GITHUB_TOKEN ?? process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (!token) throw new Error("GitHub token not found");
  return token;
}

export async function fetchUserLanguages(username: string): Promise<LanguageStat[]> {
  const token = await getToken();
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  try {
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=20&sort=updated`,
      { headers }
    );
    if (!reposRes.ok) return [];
    const repos: { name: string; owner: { login: string } }[] = await reposRes.json();
    const aggregated: Record<string, number> = {};

    for (const repo of repos.slice(0, 15)) {
      const langRes = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/languages`,
        { headers }
      );
      if (!langRes.ok) continue;
      const langs: Record<string, number> = await langRes.json();
      for (const [lang, bytes] of Object.entries(langs)) {
        aggregated[lang] = (aggregated[lang] ?? 0) + bytes;
      }
    }

    const total = Object.values(aggregated).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    const sorted = Object.entries(aggregated)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return sorted.map(([language, bytes]) => ({
      language,
      percentage: Math.round((bytes / total) * 100),
      color: LANGUAGE_COLORS[language] ?? "#8b949e",
    }));
  } catch (err) {
    console.error("Error fetching user languages:", err);
    return [];
  }
}
