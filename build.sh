#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
BILLIARDS="$ROOT/vendor/tailuge-billiards"

if ! command -v npm >/dev/null 2>&1; then
  if [ -x /tmp/node-v22.14.0-linux-x64/bin/npm ]; then
    export PATH="/tmp/node-v22.14.0-linux-x64/bin:$PATH"
  else
    echo "需要 npm。可安装 Node.js 或运行: curl ... node binary"
    exit 1
  fi
fi

cd "$BILLIARDS"
if [ ! -d node_modules/webpack ]; then
  npm install --ignore-scripts
fi
npm run build
echo "构建完成: $BILLIARDS/dist"
