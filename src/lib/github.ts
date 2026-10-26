// Repos are written as "name" (yours) or "owner/name" (e.g. an organisation's).
export const GH_USER = "phanitejakarri";

export const ghRepo = (repo: string) => (repo.includes("/") ? repo : `${GH_USER}/${repo}`);
export const repoName = (repo: string) => repo.split("/").pop()!;
export const repoUrl = (repo: string) => `https://github.com/${ghRepo(repo)}`;
export const fileUrl = (repo: string, path: string) => `${repoUrl(repo)}/blob/HEAD/${path}`;
export const gitdiagramUrl = (repo: string) => `https://gitdiagram.com/${ghRepo(repo)}`;
