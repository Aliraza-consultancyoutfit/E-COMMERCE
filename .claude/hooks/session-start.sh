#!/bin/bash
# Injects dynamic git + module context at session start. SessionStart hook.

CONTEXT=""

BRANCH=$(git branch --show-current 2>/dev/null)
if [ -n "$BRANCH" ]; then
  CONTEXT="Branch: $BRANCH"
elif git rev-parse --git-dir >/dev/null 2>&1; then
  CONTEXT="HEAD: detached at $(git rev-parse --short HEAD 2>/dev/null)"
fi

LAST_COMMIT=$(git log --oneline -1 2>/dev/null)
[ -n "$LAST_COMMIT" ] && CONTEXT="$CONTEXT | Last: $LAST_COMMIT"

CHANGES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
[ "$CHANGES" -gt 0 ] 2>/dev/null && CONTEXT="$CONTEXT | Uncommitted: $CHANGES files"

# Active module: first non-shipped row in MODULES.md
if [ -f ".claude/MODULES.md" ]; then
  ACTIVE=$(grep -E '^\| [0-9]+ ' .claude/MODULES.md | grep -vE '✅' | head -1 | sed -E 's/^\| *[0-9]+ *\| *\*\*([^*]+)\*\*.*/\1/' | tr -d '\n')
  [ -n "$ACTIVE" ] && CONTEXT="$CONTEXT | Active module: $ACTIVE"
fi

CONTEXT="$CONTEXT | Read .claude/PROJECT-STRUCTURE.md instead of scanning the repo."

[ -n "$CONTEXT" ] && echo "$CONTEXT"
exit 0
