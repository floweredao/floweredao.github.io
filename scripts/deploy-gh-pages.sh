#!/usr/bin/env bash
# 로컬에서 빌드한 dist/ 를 하나의 커밋으로 만들어 gh-pages 브랜치에 강제 푸시합니다. (GitHub Actions 없음)
# 사용법: scripts/deploy-gh-pages.sh [remote=origin] [branch=gh-pages]
set -euo pipefail

remote="${1:-origin}"
branch="${2:-gh-pages}"
root="$(cd "$(dirname "$0")/.." && pwd)"

cd "$root"
# autodeploy.sh는 check:site를 통과한 dist를 그대로 올리려고 DEPLOY_SKIP_BUILD=1을 넘깁니다.
if [ -n "${DEPLOY_SKIP_BUILD:-}" ]; then
  [ -f dist/index.html ] || { echo "dist/가 없습니다. 먼저 빌드하세요." >&2; exit 1; }
else
  bun run build
fi

remote_url="$(git remote get-url "$remote")"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

cp -R dist/. "$stage"
# autodeploy.sh가 넘겨 주면 마지막 배포 결과를 /deploy-status.json으로 함께 올립니다.
if [ -n "${DEPLOY_STATUS_FILE:-}" ]; then cp "$DEPLOY_STATUS_FILE" "$stage/deploy-status.json"; fi
git -C "$stage" init -q -b "$branch"
git -C "$stage" add -A
git -C "$stage" \
  -c user.name=floweredao \
  -c user.email=floweredao@users.noreply.github.com \
  commit -q -m "deploy: $(date +%F)"
git -C "$stage" push -f "$remote_url" "$branch"

echo "배포 완료: $remote_url 의 $branch 브랜치를 갱신했습니다."
