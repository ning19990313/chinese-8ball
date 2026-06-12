#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PUBLIC="$ROOT/public"
GAME_SRC="$ROOT/vendor/tailuge-billiards/dist"

echo "==> 构建游戏引擎..."
"$ROOT/build.sh"

echo "==> 打包静态站点到 public/ ..."
rm -rf "$PUBLIC"
mkdir -p "$PUBLIC"

cp "$ROOT/index.html" "$ROOT/online.html" "$ROOT/NOTICE.md" "$PUBLIC/"
cp -r "$ROOT/css" "$ROOT/js" "$PUBLIC/"
cp -r "$GAME_SRC" "$PUBLIC/game"

# 静态托管不支持符号链接，必须用真实目录
echo "==> 完成: $PUBLIC"
du -sh "$PUBLIC"
echo ""
echo "本地预览: cd $PUBLIC && python3 -m http.server 8765"
echo "公网部署: 将 public/ 目录发布到 GitHub Pages / Cloudflare Pages / Vercel"
