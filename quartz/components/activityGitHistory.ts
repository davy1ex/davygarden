import { execSync } from "node:child_process"
import path from "node:path"
import { Repository } from "@napi-rs/simple-git"
import { toDateKey } from "./activityUtils"

const cache = new Map<string, Map<string, number> | null>()

function resolveGitPaths(contentDirectory: string): { gitRoot: string; contentGlob: string } | null {
  const absContent = path.resolve(contentDirectory)

  let repo: Repository
  try {
    repo = Repository.discover(absContent)
  } catch {
    return null
  }

  const gitRoot = repo.workdir() ?? absContent
  let contentRel = path.relative(gitRoot, absContent)

  if (!contentRel) {
    contentRel = "."
  }

  contentRel = contentRel.split(path.sep).join("/")
  const contentGlob = contentRel === "." ? "." : `${contentRel}/`

  return { gitRoot, contentGlob }
}

function cacheKey(gitRoot: string, contentGlob: string, sinceKey: string): string {
  return `${gitRoot}:${contentGlob}:${sinceKey}`
}

/**
 * Count content commits per day from git history (GitHub-style activity).
 * `contentDirectory` is Quartz's content folder (argv.directory, usually "content").
 * Returns null when git is unavailable.
 */
export function collectGitActivityCounts(
  contentDirectory: string,
  since: Date,
): Map<string, number> | null {
  const resolved = resolveGitPaths(contentDirectory)
  if (!resolved) {
    return null
  }

  const { gitRoot, contentGlob } = resolved
  const sinceKey = toDateKey(since)
  const key = cacheKey(gitRoot, contentGlob, sinceKey)

  if (cache.has(key)) {
    return cache.get(key)!
  }

  const counts = new Map<string, number>()

  try {
    const output = execSync(
      `git log --format=%ad --date=short --since=${sinceKey} -- ${contentGlob}`,
      {
        cwd: gitRoot,
        encoding: "utf-8",
        maxBuffer: 16 * 1024 * 1024,
      },
    )

    for (const line of output.split("\n")) {
      const dateKey = line.trim()
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue
      counts.set(dateKey, (counts.get(dateKey) ?? 0) + 1)
    }
  } catch {
    cache.set(key, null)
    return null
  }

  cache.set(key, counts)
  return counts
}

export function clearGitActivityCache(): void {
  cache.clear()
}
