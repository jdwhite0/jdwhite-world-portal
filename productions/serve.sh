#!/usr/bin/env bash
# Preview JD Productions site locally
cd "$(dirname "$0")"
PORT="${1:-8080}"
echo "JD Productions → http://127.0.0.1:${PORT}"
echo "Press Ctrl+C to stop."
python3 -m http.server "$PORT"
