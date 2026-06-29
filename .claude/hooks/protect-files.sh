#!/bin/bash
# Blocks edits to sensitive or generated files.
# PreToolUse hook for Edit|Write. Exit 2 = block.

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Allow .claude/skills edits even though other .claude files are protected
case "$FILE_PATH" in
  *.claude/skills/*) exit 0 ;;
esac

BASENAME=$(basename "$FILE_PATH")

PROTECTED_PATTERNS=(
  ".env" ".env.*" "*.pem" "*.key" "*.crt" "*.p12" "*.pfx"
  "id_rsa" "id_ed25519" "credentials.json" ".npmrc"
  "package-lock.json" "yarn.lock" "pnpm-lock.yaml"
  "*.gen.ts" "*.generated.*" "*.min.js" "*.min.css"
  "next-env.d.ts"
)
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  case "$BASENAME" in
    $pattern)
      echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Protected file: $BASENAME matches '$pattern'. Edit manually if truly needed.\"}}"
      exit 2 ;;
  esac
done

case "$FILE_PATH" in
  .git/*|*/.git/*)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Cannot edit files inside .git/\"}}"; exit 2 ;;
  *.env|*/.env|*.env.*|*/.env.*)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Cannot edit .env files — secrets stay out of the agent's hands.\"}}"; exit 2 ;;
  *.claude/hooks/*)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Cannot edit hook scripts — they enforce security boundaries. Edit manually.\"}}"; exit 2 ;;
  *.claude/settings.json)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"Editing settings.json controls permissions and hooks. Confirm.\"}}"; exit 2 ;;
  *.claude/settings.local.json)
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"Cannot edit settings.local.json — it holds local secrets (e.g. FIGMA_TOKEN). Edit manually.\"}}"; exit 2 ;;
esac

exit 0
