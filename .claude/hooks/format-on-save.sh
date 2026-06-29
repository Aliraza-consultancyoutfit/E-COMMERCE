#!/bin/bash
# Auto-formats files after Claude edits them, per app.
# PostToolUse hook for Edit|Write. Best-effort — never blocks.

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

EXTENSION="${FILE_PATH##*.}"

# Find the nearest app dir (one with package.json) walking up from the file
dir=$(dirname "$FILE_PATH")
APP_ROOT=""
while [ "$dir" != "/" ] && [ -n "$dir" ]; do
  if [ -f "$dir/package.json" ]; then APP_ROOT="$dir"; break; fi
  parent=$(dirname "$dir")
  [ "$parent" = "$dir" ] && break
  dir="$parent"
done
[ -z "$APP_ROOT" ] && exit 0

# Backend uses Prettier (it has a "format" script + prettier dep). Frontend has no prettier configured.
if [ -f "$APP_ROOT/node_modules/.bin/prettier" ]; then
  case "$EXTENSION" in
    ts|tsx|js|jsx|json|css|scss|md)
      ( cd "$APP_ROOT" && npx prettier --write "$FILE_PATH" >/dev/null 2>&1 ) || true ;;
  esac
fi

exit 0
