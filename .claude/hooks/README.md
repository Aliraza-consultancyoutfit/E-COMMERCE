# Hooks

Shell hooks the harness runs automatically (wired in `../settings.json`). They enforce safety so the agent can move fast without breaking things. On Windows they run via Git Bash; all require `jq` (they no-op safely if `jq` is missing).

| Hook | Event | What it does |
|---|---|---|
| `session-start.sh` | SessionStart | Prints git state + the **active module** from `MODULES.md`, and reminds agents to read `PROJECT-STRUCTURE.md` instead of scanning. |
| `block-dangerous-commands.sh` | PreToolUse · Bash | Blocks push to main/master, force-push, `reset --hard`, `clean -f`, broad `rm -rf`, Mongo `drop()`/`deleteMany({})`, SQL DROP/TRUNCATE, curl-pipe-to-shell, package publish. |
| `protect-files.sh` | PreToolUse · Edit/Write | Blocks edits to `.env`, keys/certs, lock files, generated files, `.git/`, hook scripts; **asks** before editing `settings.json`; denies `settings.local.json`. Allows `.claude/skills/*`. |
| `scan-secrets.sh` | PreToolUse · Edit/Write | **Asks** before writing content that looks like a secret (AWS/GitHub/Stripe keys, private keys, credentialed connection strings, hardcoded passwords). Allows env-var references. |
| `warn-large-files.sh` | PreToolUse · Edit/Write | Blocks writes into `node_modules/`, `.next/`, `dist/`, `build/`, and binary/media/archive files. |
| `format-on-save.sh` | PostToolUse · Edit/Write | Runs Prettier in the owning app if available (BE has it). Best-effort, never blocks. |

## Notes
- These scripts are themselves protected (`protect-files.sh` denies editing `.claude/hooks/*`). Change them manually, outside the agent, on purpose.
- `deny` (exit 2) blocks the action; `ask` prompts the user to confirm/override (good for test fixtures and intentional config edits).
- The push gate is intentional: shipping a module happens only through `/module-ship` after the user approves.
