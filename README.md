# floweredao

floweredao의 블로그와 작업물(포트폴리오)을 담는 정적 사이트입니다. [Astro 7](https://astro.build)로 만들고, 빌드 결과를 GitHub Pages(`https://floweredao.github.io`)에 올립니다. GitHub Actions는 쓰지 않고, 로컬에서 빌드한 `dist/`를 `gh-pages` 브랜치에 직접 올립니다.

- `/` 홈: 소개, 작업물 카드, 최신 글
- `/blog/` 블로그 목록, `/blog/<slug>/` 글
- `/portfolio/` 작업물 목록, `/portfolio/<slug>/` 작업물 상세
- `/rss.xml` 블로그 RSS(공개 글만), `/sitemap-index.xml` 사이트맵, `/robots.txt`

## 요구 사항

- [Bun](https://bun.sh) 1.4 이상 (패키지 관리와 스크립트 실행에 사용)
- Node.js 22 이상 (Astro CLI 실행에 사용)

## 실행

```sh
bun install          # 의존성 설치 (처음 한 번)
bun run dev          # 개발 서버 http://localhost:4321 (저장하면 바로 반영)
bun run build        # 정적 빌드 → dist/
bun run preview      # dist/ 를 로컬에서 미리 보기
bun run check        # 타입·템플릿 검사 (astro check)
```

`bun run build`가 0으로 끝나야 배포할 수 있습니다. frontmatter가 스키마와 맞지 않으면 빌드가 어떤 파일의 어떤 항목이 잘못됐는지 알려 주며 멈춥니다.

## 브라우저에서 글 쓰기 (관리자 페이지)

컴퓨터나 휴대폰 브라우저로 **https://floweredao.github.io/admin/** 에 들어가면 글을 쓸 수 있습니다. 사이트 메뉴에는 보이지 않고 검색에도 잡히지 않게(noindex) 해 두었으니 주소를 즐겨찾기에 넣어 두세요. 화면은 [Sveltia CMS](https://sveltiacms.app)(MIT)이고 설정은 `public/admin/config.yml`에 있습니다.

1. **로그인**: "Sign In with GitHub"를 누르고 floweredao 계정으로 로그인합니다. 처음 한 번은 GitHub가 "floweredao 글 관리" 앱에 권한을 줄지 물으니 **Authorize**를 누릅니다. 이 저장소에 쓰기 권한이 있는 계정만 들어갈 수 있습니다.
2. **새 글**: 왼쪽 "블로그 글" → "새로 만들기". 제목·요약·날짜·태그·본문을 채웁니다. 본문 편집기의 이미지 버튼으로 사진을 올리면 `public/images/blog/`에 저장되고 본문에 `/images/blog/파일명`으로 들어갑니다. 이미지 설명(alt)은 꼭 적어 주세요. 비어 있으면 점검에서 배포가 멈춥니다.
3. **주소(파일 이름)**: 새 글을 만들 때 나오는 슬러그 칸이 `/blog/<슬러그>/` 주소가 됩니다. 제목으로 미리 채워지지만 영문 소문자·숫자·하이픈으로 바꿔 쓰는 편이 안전합니다(예: `first-post`). 저장한 뒤에는 바꿀 수 없습니다.
4. **임시저장**: "임시저장(공개 안 함)"은 새 글에서 켜져 있습니다. 켜 둔 채로 저장하면 저장소에는 남지만 사이트에는 나오지 않습니다. 공개할 때 끄고 다시 저장합니다.
5. **저장 = 배포**: 저장하면 `main` 브랜치에 커밋이 하나 생깁니다. 1–3분 안에 아래 "자동 배포"가 빌드·점검하고 사이트에 올립니다. 오른쪽 미리보기는 저장 전에 대략의 모양을 보여 줍니다(사이트 디자인과 글꼴은 다를 수 있습니다).
6. **수정·삭제**: 목록에서 글을 열어 고치거나 삭제합니다. 이것도 커밋이 되고 자동으로 배포됩니다.

로그인은 Cloudflare Pages의 `floweredao-cms-auth`(https://floweredao-cms-auth.pages.dev, [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) 코드 그대로)가 GitHub OAuth를 중계합니다. OAuth 비밀값은 그 프로젝트의 비밀 변수와 이 맥 키체인에만 있고 저장소에는 없습니다.

파일을 직접 고치고 싶다면 아래처럼 마크다운 파일을 만들어도 됩니다.

## 블로그 글 쓰기 (파일로)

`src/content/blog/` 아래에 마크다운 파일 하나가 글 하나입니다. **파일 이름이 주소(slug)** 가 됩니다. 예를 들어 `src/content/blog/hello.md`는 `/blog/hello/`로 열립니다. 파일 이름은 영문 소문자, 숫자, 하이픈(`-`)만 쓰는 편이 안전합니다.

```md
---
title: "글 제목"
description: "목록과 검색 결과에 보이는 한두 문장 요약"
date: 2026-10-01
draft: false
tags: ["공지", "astro"]
---

본문은 여기에 마크다운으로 씁니다.

## 소제목

문단, 목록, 링크, 코드 블록, 표, 이미지를 모두 쓸 수 있습니다.
```

| 항목 | 필수 | 설명 |
| --- | --- | --- |
| `title` | 예 | 글 제목 |
| `description` | 예 | 요약. 목록 카드, `<meta name="description">`, Open Graph에 쓰입니다 |
| `date` | 예 | `YYYY-MM-DD`. 목록은 이 날짜의 최신순으로 정렬되고, 화면에는 `2026년 10월 1일`처럼 보입니다 |
| `draft` | 아니오 | `true`면 빌드(배포)에서 빠집니다. 개발 서버(`bun run dev`)에서는 보입니다. 기본값 `false` |
| `tags` | 아니오 | 문자열 배열. 목록과 글 상단에 표시됩니다 |

글에 이미지를 넣으려면 `public/images/<slug>/` 아래에 파일을 두고 절대 경로로 참조합니다.

```md
![스크린샷 설명](/images/hello/screenshot.webp)
```

`![...]` 대괄호 안의 설명(alt)은 비워 두지 마세요. 이미지가 안 보이는 상황과 스크린 리더에서 그 설명이 대신 읽힙니다.

## 작업물(포트폴리오) 추가

`src/content/portfolio/` 아래에 마크다운 파일 하나가 작업물 하나입니다. 여기도 **파일 이름이 주소**입니다(`speech2text.md` → `/portfolio/speech2text/`). 이미지는 `public/images/<slug>/`에 두고 `/images/<slug>/파일명`으로 참조합니다.

```md
---
title: "Speech2Text"
tagline: "제목 아래 한 줄로 보이는 소개"
summary: "목록 카드에 보이는 한두 문장 요약"
audience: "누구를 위한 것인지"
platform: "macOS 26 이상 · Apple Silicon"
year: "2026"
order: 1
visibility: "public"          # public | private
stack: ["Swift", "SwiftUI"]
links:                         # visibility가 private이면 [] 로 둡니다
  - label: "GitHub 저장소"
    href: "https://github.com/floweredao/speech2text"
cover:
  src: "/images/speech2text/hero.webp"
  alt: "커버 이미지 설명"
features:
  - title: "기능 이름"
    body: "기능을 한두 문장으로"
gallery:
  - src: "/images/speech2text/notch-idle.webp"
    alt: "이미지 설명"
    caption: "이미지 아래에 보이는 캡션"
---

긴 소개는 여기에 씁니다. 소제목은 `## `로 시작합니다.

## 왜 만들었나
```

| 항목 | 설명 |
| --- | --- |
| `order` | 목록 순서. 작은 숫자가 먼저 옵니다 |
| `visibility` | `public`이면 "공개 저장소" 배지가 붙고 `links`가 버튼으로 보입니다. `private`이면 "비공개 프로젝트" 배지와 "소스 코드는 공개하지 않는 프로젝트입니다." 안내가 보이고 링크는 숨겨집니다 |
| `links` | `{ label, href }` 배열. 첫 번째 링크가 강조 버튼이 됩니다. 없으면 `[]` |
| `cover` | 카드와 상세 상단에 쓰는 대표 이미지. `alt`는 필수입니다 |
| `features` | "주요 기능" 격자. 없으면 `[]` |
| `gallery` | "화면" 격자. 각 항목에 `src`, `alt`, `caption`이 모두 필요합니다. 없으면 `[]` |
| `stack` | "사용 기술" 태그 목록 |

이미지의 가로·세로 크기는 빌드할 때 파일에서 자동으로 읽어 `<img width height>`로 넣으므로 frontmatter에 적지 않아도 됩니다. 파일이 없으면 빌드는 통과하되 경고가 출력됩니다.

## 배포 (gh-pages 브랜치)

GitHub Pages는 `gh-pages` 브랜치의 루트(`/`)를 그대로 서비스합니다. 저장소 Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **gh-pages / (root)** 로 한 번만 설정해 두면 됩니다. `public/.nojekyll`이 `dist/`로 복사되므로 Jekyll 처리 없이 파일이 그대로 올라갑니다.

### 자동 배포 (main에 커밋하면)

이 맥의 LaunchAgent `local.portfolio-autodeploy`(`~/Library/LaunchAgents/local.portfolio-autodeploy.plist`)가 1분마다 `scripts/autodeploy.sh`를 돌립니다. 작업 폴더는 `~/.local/share/portfolio-autodeploy/`(전용 클론 `repo/`, 마지막 로그 `last-run.log`)입니다. `origin/main`에 새 커밋이 있으면 `bun run build` → `bun run check:site` → `scripts/deploy-gh-pages.sh` 순서로 돌고, 하나라도 실패하면 배포하지 않습니다. 결과는 `~/.local/share/ddolmeng-mode/state/events.log`에 한 줄씩 남습니다.

```
EVENT PORTFOLIO_DEPLOYED <커밋>
EVENT PORTFOLIO_DEPLOY_FAIL <커밋> <install|build|check:site|deploy> (로그: …/last-run.log)
```

#### 마지막 배포 상태 확인 (저장한 글이 안 보일 때)

휴대폰에서도 **https://floweredao.github.io/deploy-status.json** 을 열면 마지막 자동 배포 결과가 보입니다. 검색에는 잡히지 않게 `robots.txt`에서 막아 두었고 사이트 메뉴에도 없습니다.

```json
{ "commit": "마지막으로 처리한 main 커밋", "result": "success | failed", "failedStep": "install | build | check:site | deploy | null",
  "finishedAt": "UTC 시각", "liveCommit": "지금 사이트에 올라가 있는 커밋" }
```

- `commit`이 GitHub `main`의 최신 커밋과 같고 `result`가 `success`면 배포는 끝났습니다. 그래도 글이 안 보이면 글의 "임시저장"이 켜져 있는지 확인합니다(브라우저 캐시도 1–2분 남을 수 있습니다).
- `result`가 `failed`면 `failedStep` 단계에서 멈춘 것이고, 사이트는 `liveCommit` 상태 그대로입니다. 자세한 원인은 이 맥의 `last-run.log`에 있습니다. 흔한 원인은 alt가 빈 이미지(`check:site`)나 잘못된 frontmatter(`build`)입니다.
- `commit`이 최신 커밋보다 예전이면 아직 도는 중이거나(보통 3분 안) 이 맥의 자동 배포가 꺼져 있는 것입니다.

성공하면 이 파일이 빌드와 함께 올라가고, 실패하면 사이트 내용은 그대로 두고 `gh-pages`에 이 파일만 바꾼 커밋을 일반 푸시로 올립니다.

실패한 커밋은 다시 시도하지 않고, 고친 커밋이 올라오면 그것을 배포합니다. 멈추려면 `launchctl bootout gui/$(id -u)/local.portfolio-autodeploy`, 다시 켜려면 `launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/local.portfolio-autodeploy.plist`.

### 스크립트로 올리기

```sh
scripts/deploy-gh-pages.sh            # origin 의 gh-pages 브랜치로
scripts/deploy-gh-pages.sh origin main-site   # 원격·브랜치를 바꾸고 싶을 때
```

스크립트가 하는 일:

1. `bun run build`로 `dist/`를 새로 만듭니다.
2. 임시 폴더에 `dist/` 내용만으로 커밋 하나를 만듭니다. (커밋 작성자는 `floweredao <floweredao@users.noreply.github.com>`)
3. 그 커밋을 원격의 `gh-pages` 브랜치로 강제 푸시합니다. 배포 브랜치는 항상 최신 빌드 한 개의 커밋만 가지며, 소스 이력은 `main`에만 남습니다.

### 손으로 올리기

스크립트 없이 같은 일을 하려면:

```sh
bun run build
tmp="$(mktemp -d)"
cp -R dist/. "$tmp"
git -C "$tmp" init -q -b gh-pages
git -C "$tmp" add -A
git -C "$tmp" -c user.name=floweredao -c user.email=floweredao@users.noreply.github.com commit -q -m "deploy: $(date +%F)"
git -C "$tmp" push -f "$(git remote get-url origin)" gh-pages
rm -rf "$tmp"
```

푸시 뒤 1–2분이면 `https://floweredao.github.io/`에 반영됩니다. GitHub Actions 워크플로는 없고 앞으로도 두지 않습니다. `dist/`, `node_modules/`, `.astro/`는 `.gitignore`에 있어 `main`에 올라가지 않습니다.

## 프로젝트 구조

```
astro.config.mjs        사이트 주소, trailingSlash, 빌드 형식
src/content.config.ts   blog · portfolio 컬렉션 스키마 (frontmatter 검증)
src/content/blog/       블로그 글 (*.md)
src/content/portfolio/  작업물 (*.md)
src/pages/              라우트 (index, blog/, portfolio/, 404)
src/layouts/            BaseLayout(머리글·바닥글·메타), PostLayout, WorkLayout
src/components/         카드, 목록, 배지, 버튼, 라벨, 갤러리 등
src/styles/             tokens.css(디자인 토큰) · base.css · prose.css · motion.css
src/lib/                컬렉션 조회·정렬·날짜 형식, 이미지 크기 읽기
public/                 favicon.svg, .nojekyll, images/<slug>/…
scripts/deploy-gh-pages.sh   dist/ 를 gh-pages 로 올리는 스크립트
scripts/autodeploy.sh   main 새 커밋 → 빌드·점검·배포 (LaunchAgent가 1분마다)
public/admin/           관리자 페이지(Sveltia CMS) index.html · config.yml
DESIGN.md               디자인 시스템 계약 (색·서체·간격·컴포넌트·모션)
```

디자인 값은 전부 `src/styles/tokens.css`에 있고, 그 근거와 규칙은 `DESIGN.md`에 있습니다. 색이나 크기를 바꿀 때는 토큰을 고치세요.
