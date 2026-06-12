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

# GitHub Pages：禁用 Jekyll 处理，避免静态资源 404
touch "$PUBLIC/.nojekyll"

# 友好 404（误访问子路径时跳回首页）
cat > "$PUBLIC/404.html" <<'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=./index.html">
  <title>页面不存在 · 中式八球</title>
  <script>location.replace('./index.html')</script>
</head>
<body>
  <p><a href="./index.html">返回中式八球首页</a> · <a href="./online.html">在线联机</a></p>
</body>
</html>
EOF

# 静态托管不支持符号链接，必须用真实目录
echo "==> 完成: $PUBLIC"
du -sh "$PUBLIC"
echo ""
echo "本地预览: cd $PUBLIC && python3 -m http.server 8765"
echo "公网部署: 将 public/ 目录发布到 GitHub Pages / Cloudflare Pages / Vercel"
