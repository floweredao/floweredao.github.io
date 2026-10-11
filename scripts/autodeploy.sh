#!/usr/bin/env bash
# origin/main에 새 커밋이 있으면 전용 작업 폴더에서 빌드 → check:site → gh-pages 배포를 합니다.
# LaunchAgent(local.portfolio-autodeploy)가 1분마다 실행합니다. GitHub Actions는 쓰지 않습니다.
# 환경 변수로 바꿀 수 있는 값: PORTFOLIO_REPO_URL, PORTFOLIO_DEPLOY_DIR, PORTFOLIO_EVENTS_LOG
set -uo pipefail

repo_url="${PORTFOLIO_REPO_URL:-https://github.com/floweredao/floweredao.github.io.git}"
work="${PORTFOLIO_DEPLOY_DIR:-$HOME/.local/share/portfolio-autodeploy}"
events="${PORTFOLIO_EVENTS_LOG:-$HOME/.local/share/ddolmeng-mode/state/events.log}"
repo="$work/repo"
log="$work/last-run.log"

export PATH="$HOME/.bun/bin:$HOME/.nvm/versions/node/v26.8.1/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
# launchd에는 터미널이 없어 자격 증명 입력을 기다리면 멈춥니다. gh 로그인 토큰으로만 푸시합니다.
export GIT_TERMINAL_PROMPT=0
export GIT_CONFIG_COUNT=2
export GIT_CONFIG_KEY_0=credential.helper GIT_CONFIG_VALUE_0=
export GIT_CONFIG_KEY_1=credential.helper GIT_CONFIG_VALUE_1='!gh auth git-credential'

mkdir -p "$work" "$(dirname "$events")"
lock="$work/lock"
if ! mkdir "$lock" 2>/dev/null; then
  # 30분 넘은 잠금은 죽은 실행이 남긴 것으로 봅니다.
  if [ -n "$(find "$lock" -maxdepth 0 -mmin +30 2>/dev/null)" ]; then
    rm -rf "$lock" && mkdir "$lock" || exit 0
  else
    exit 0
  fi
fi
trap 'rm -rf "$lock"' EXIT

if [ ! -d "$repo/.git" ]; then
  git clone -q "$repo_url" "$repo" || exit 0
fi
git -C "$repo" fetch -q origin main || exit 0

commit="$(git -C "$repo" rev-parse origin/main)"
short="${commit:0:7}"
[ "$commit" = "$(cat "$work/last-deployed" 2>/dev/null)" ] && exit 0
[ "$commit" = "$(cat "$work/last-failed" 2>/dev/null)" ] && exit 0

fail() {
  echo "$commit" >"$work/last-failed"
  echo "EVENT PORTFOLIO_DEPLOY_FAIL $short $1 (로그: $log)" >>"$events"
  exit 1
}

{
  echo "== $(date '+%F %T') $commit"
  git -C "$repo" checkout -q --force --detach "$commit" &&
    git -C "$repo" clean -q -fdx -e node_modules
} >"$log" 2>&1 || fail "checkout"

cd "$repo"
if [ ! -d node_modules ] || ! cmp -s bun.lock node_modules/.autodeploy-bun.lock; then
  bun install --frozen-lockfile >>"$log" 2>&1 || fail "install"
  cp bun.lock node_modules/.autodeploy-bun.lock
fi
bun run build >>"$log" 2>&1 || fail "build"
bun run check:site >>"$log" 2>&1 || fail "check:site"
bash scripts/deploy-gh-pages.sh >>"$log" 2>&1 || fail "deploy"

echo "$commit" >"$work/last-deployed"
rm -f "$work/last-failed"
# LaunchAgent는 $work/autodeploy.sh 사본을 실행합니다(~/Documents는 launchd에서 읽지 못함). 새 inode로 바꿔 실행 중인 파일을 건드리지 않습니다.
cp scripts/autodeploy.sh "$work/autodeploy.sh.new" && mv "$work/autodeploy.sh.new" "$work/autodeploy.sh"
echo "EVENT PORTFOLIO_DEPLOYED $short" >>"$events"
