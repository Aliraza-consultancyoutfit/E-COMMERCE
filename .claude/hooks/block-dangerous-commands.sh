#!/bin/bash
# Blocks destructive shell commands before they run.
# PreToolUse hook for Bash. Exit 2 = block, exit 0 = allow.

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

deny() {
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"$1\"}}"
  exit 2
}

# ── Git protections ──────────────────────────────
if echo "$COMMAND" | grep -qE '(^|[;&|()]+[[:space:]]*)git[[:space:]]+push'; then
  if echo "$COMMAND" | grep -qE 'git[[:space:]]+push.*(origin[[:space:]]+|:)(main|master)\b'; then
    deny "Blocked: cannot push directly to main/master. Use a feature branch and create a PR."
  fi
  if echo "$COMMAND" | grep -qE 'git[[:space:]]+push[[:space:]]*($|[;&|])'; then
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
      deny "Blocked: you are on $CURRENT_BRANCH. Use a feature branch (feature/<nn>-<module>) and create a PR."
    fi
  fi
  if echo "$COMMAND" | grep -qE 'git[[:space:]]+push.*(-[a-zA-Z]*f|--force)([[:space:]]|$)' && ! echo "$COMMAND" | grep -q '\-\-force-with-lease'; then
    deny "Blocked: force push is not allowed. Use --force-with-lease if you must overwrite remote."
  fi
fi

if echo "$COMMAND" | grep -qE 'git[[:space:]]+reset[[:space:]]+--hard'; then
  deny "Blocked: git reset --hard discards uncommitted work permanently. Use git stash or --soft."
fi
if echo "$COMMAND" | grep -qE 'git[[:space:]]+clean[[:space:]]+-[a-zA-Z]*f'; then
  deny "Blocked: git clean -f permanently deletes untracked files. Review with git clean -n first."
fi

# ── Destructive filesystem ───────────────────────
if echo "$COMMAND" | grep -qE 'rm[[:space:]]+-[a-zA-Z]*r[a-zA-Z]*f[[:space:]]+(\/|~|\$HOME|\.\.\/\.\.)'; then
  deny "Blocked: recursive force-delete on root/home/parent paths. Specify a safe target."
fi

# ── MongoDB destructive ops ──────────────────────
if echo "$COMMAND" | grep -qiE '\.drop(Database)?\(\)' ; then
  deny "Blocked: MongoDB drop()/dropDatabase() is destructive. Run manually outside Claude Code if intended."
fi
if echo "$COMMAND" | grep -qiE 'deleteMany\(\s*\{\s*\}\s*\)'; then
  deny "Blocked: deleteMany({}) deletes the whole collection. Add a filter."
fi

# ── SQL destructive (in case of any SQL tooling) ─
if echo "$COMMAND" | grep -qiE 'DROP[[:space:]]+(TABLE|DATABASE|SCHEMA)[[:space:]]'; then
  deny "Blocked: DROP TABLE/DATABASE/SCHEMA is irreversible. Run manually if intended."
fi
if echo "$COMMAND" | grep -qiE 'TRUNCATE[[:space:]]+TABLE'; then
  deny "Blocked: TRUNCATE TABLE is destructive. Run manually if intended."
fi

# ── System / supply chain ────────────────────────
if echo "$COMMAND" | grep -qE 'chmod[[:space:]]+777'; then
  deny "Blocked: chmod 777 is overly permissive. Use 755/644."
fi
if echo "$COMMAND" | grep -qE '(curl|wget)[[:space:]].*\|[[:space:]]*(bash|sh|zsh|sudo)'; then
  deny "Blocked: piping downloaded content into a shell is dangerous. Download, inspect, then run."
fi
if echo "$COMMAND" | grep -qE '(mkfs|dd[[:space:]]+if=|>[[:space:]]*/dev/)'; then
  deny "Blocked: destructive disk operation detected."
fi
if echo "$COMMAND" | grep -qE '(npm|yarn|pnpm|bun)[[:space:]]+publish'; then
  deny "Blocked: package publishing should be done manually or via CI, not through Claude Code."
fi

exit 0
