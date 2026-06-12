#!/usr/bin/env bash
# 用 ning19990313 专用 SSH 密钥推送
set -euo pipefail
cd "$(dirname "$0")"
git remote set-url origin git@github-ning:ning19990313/chinese-8ball.git
echo "测试 SSH 连接..."
ssh -T git@github-ning 2>&1 | head -1 || true
echo "推送中..."
git push -u origin main
echo "完成！请到 GitHub 仓库 Settings → Pages → Source 选 GitHub Actions"
