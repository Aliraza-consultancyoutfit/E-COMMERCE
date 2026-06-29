#!/bin/bash
# Warns before writing content that looks like a secret.
# PreToolUse hook for Edit|Write. Uses "ask" so the user can override test fixtures.

if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

if [ "$TOOL_NAME" = "Write" ]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
elif [ "$TOOL_NAME" = "Edit" ]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.new_string // empty')
else
  exit 0
fi

[ -z "$CONTENT" ] && exit 0

MATCHES=""
echo "$CONTENT" | grep -qE 'AKIA[0-9A-Z]{16}' && MATCHES="$MATCHES AWS access key;"
echo "$CONTENT" | grep -qE '(ghp_|gho_|ghs_|ghr_|github_pat_)[a-zA-Z0-9_]{20,}' && MATCHES="$MATCHES GitHub token;"
echo "$CONTENT" | grep -qE 'sk_(live|test)_[a-zA-Z0-9]{16,}' && MATCHES="$MATCHES Stripe secret key;"
echo "$CONTENT" | grep -qE 'sk-[a-zA-Z0-9]{20,}' && MATCHES="$MATCHES API key (sk-...);"
echo "$CONTENT" | grep -qE -- '-----BEGIN[[:space:]]+(RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----' && MATCHES="$MATCHES private key block;"
echo "$CONTENT" | grep -qE '(mongodb(\+srv)?|postgres|mysql|redis|amqp)://[^:[:space:]]+:[^@[:space:]]+@' && MATCHES="$MATCHES connection string with credentials;"

# Generic hardcoded credential, excluding env-var references
if echo "$CONTENT" | grep -qiE '(password|secret|token|api_key|apikey|jwt_secret)[[:space:]]*[=:][[:space:]]*["\x27][^"\x27]{8,}["\x27]' && \
   ! echo "$CONTENT" | grep -qiE '(process\.env|configService|getOrThrow|\$\{|ENV\[|<|example|change-me|placeholder)'; then
  MATCHES="$MATCHES hardcoded credential;"
fi

if [ -n "$MATCHES" ]; then
  REASON="Possible secret in content:$MATCHES Review before allowing (secrets belong in .env)."
  echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"ask\",\"permissionDecisionReason\":\"$REASON\"}}"
  exit 2
fi

exit 0
