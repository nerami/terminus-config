import { tool } from "@langchain/core/tools"
import { z } from "zod"
import { spawnSync } from "node:child_process"

function repoRoot(): string {
  return process.env.REPO_ROOT ?? process.cwd()
}

function git(args: string[]): string {
  const result = spawnSync("git", args, {
    cwd: repoRoot(),
    encoding: "utf-8",
    timeout: 30_000,
  })
  const out = [result.stdout, result.stderr].filter(Boolean).join("\n")
  return out || (result.error ? String(result.error) : "")
}

const gitStatus = tool(
  async () => git(["status", "--short"]),
  {
    name: "ha_git_status",
    description: "Show git status of the HA config repo (short format). Use before committing.",
    schema: z.object({}),
  },
)

const gitDiff = tool(
  async ({ file }) => git(file ? ["diff", "--", file] : ["diff"]),
  {
    name: "ha_git_diff",
    description: "Show git diff of uncommitted changes. Optionally filter to a specific file.",
    schema: z.object({ file: z.string().optional().describe("Specific file path to diff, relative to repo root") }),
  },
)

const gitCommit = tool(
  async ({ message, files }) => {
    const addResult = git(["add", "--", ...(files ?? ["packages/"])])
    if (addResult.includes("fatal") || addResult.includes("error")) return `git add failed:\n${addResult}`
    const commitResult = git(["commit", "-m", message])
    return [addResult, commitResult].filter(Boolean).join("\n")
  },
  {
    name: "ha_git_commit",
    description:
      "Stage and commit HA config changes. Defaults to staging packages/ only. Always validate config before calling this.",
    schema: z.object({
      message: z.string().describe("Conventional commit message e.g. 'feat(lights): add hysteresis to lr auto'"),
      files: z.array(z.string()).optional().describe("Files/dirs to stage. Defaults to ['packages/']. Paths relative to repo root."),
    }),
  },
)

export const haGitTools = [gitStatus, gitDiff, gitCommit]
