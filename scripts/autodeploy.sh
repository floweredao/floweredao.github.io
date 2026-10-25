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
# last-failed: "<커밋> <단계> <횟수>". build·check:site 실패는 코드 문제라 같은 커밋을 다시 돌리지 않습니다.
# checkout·install·deploy는 네트워크·토큰 같은 일시 오류일 수 있어 같은 커밋을 max_tries번까지 다시 시도합니다.
max_tries=3
read -r failed_commit failed_step failed_count 2>/dev/null <"$work/last-failed"
if [ "$commit" = "${failed_commit:-}" ]; then
  case "${failed_step:-}" in
    checkout | install | deploy) [ "${failed_count:-$max_tries}" -ge "$max_tries" ] && exit 0 ;;
    *) exit 0 ;;
  esac
fi

# 사이트의 /deploy-status.json에 올릴 마지막 배포 결과. 경로·로그 같은 내부 정보는 넣지 않습니다.
status="$work/deploy-status.json"
write_status() { # <success|failed> <실패 단계 또는 빈 값>
  printf '{\n  "commit": "%s",\n  "result": "%s",\n  "failedStep": %s,\n  "finishedAt": "%s",\n  "liveCommit": "%s"\n}\n' \
    "$commit" "$1" "$([ -n "$2" ] && echo "\"$2\"" || echo null)" "$(date -u +%FT%TZ)" \
    "$([ "$1" = success ] && echo "$commit" || cat "$work/last-deployed" 2>/dev/null)" >"$status"
}

# 실패해도 사이트 내용은 그대로 두고 gh-pages의 deploy-status.json만 일반 커밋으로 바꿉니다.
publish_failed_status() {
  local stage
  stage="$(mktemp -d)" || return 1
  git clone -q --depth 1 -b gh-pages "$(git -C "$repo" remote get-url origin)" "$stage" &&
    cp "$status" "$stage/deploy-status.json" &&
    git -C "$stage" add deploy-status.json &&
    git -C "$stage" -c user.name=floweredao -c user.email=floweredao@users.noreply.github.com \
      commit -q -m "deploy-status: $short failed" &&
    git -C "$stage" push -q origin gh-pages
  local rc=$?
  rm -rf "$stage"
  return $rc
}

fail() {
  local tries=1
  [ "$commit" = "${failed_commit:-}" ] && [ "$1" = "${failed_step:-}" ] && tries=$((${failed_count:-0} + 1))
  echo "$commit $1 $tries" >"$work/last-failed"
  write_status failed "$1"
  publish_failed_status >>"$log" 2>&1 || echo "deploy-status.json 올리기 실패" >>"$log"
  echo "EVENT PORTFOLIO_DEPLOY_FAIL $short $1 (시도 $tries, 로그: $log)" >>"$events"
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
write_status success ""
DEPLOY_STATUS_FILE="$status" bash scripts/deploy-gh-pages.sh >>"$log" 2>&1 || fail "deploy"

echo "$commit" >"$work/last-deployed"
rm -f "$work/last-failed"
# LaunchAgent는 $work/autodeploy.sh 사본을 실행합니다(~/Documents는 launchd에서 읽지 못함). 새 inode로 바꿔 실행 중인 파일을 건드리지 않습니다.
cp scripts/autodeploy.sh "$work/autodeploy.sh.new" && mv "$work/autodeploy.sh.new" "$work/autodeploy.sh"
echo "EVENT PORTFOLIO_DEPLOYED $short" >>"$events"
