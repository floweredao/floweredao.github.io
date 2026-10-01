# floweredao 디자인 시스템

StyleGallery의 **Warm Print** 방향(`expression/directions/warm-print.md`)을 한국어 블로그 + 작업물 아카이브라는 이 사이트의 콘텐츠에 맞게 옮긴 구현 계약입니다. 색, 글자 크기, 간격, 반경, 모션 값은 전부 `src/styles/tokens.css`의 토큰으로만 쓰고, 토큰에 없는 값이 필요하면 이 문서와 `tokens.css`를 먼저 고친 뒤 사용합니다.

## 0. Research Log

- Embedded refs: 사용자가 방향을 지정함(StyleGallery Warm Print). frontend 스킬의 Layer A/B 탐색 대신 Warm Print의 값을 그대로 계약으로 채택했다. 레이아웃은 StyleGallery `recipes/homepage.md`(섹션 역할: hook → prove → navigate), `recipes/article-page.md`(읽기 폭을 `max-inline-size`로 명시), `patterns/grid-repetition/card-grid.md`, `patterns/in-line-grouping/wrap-row.md`를 채택했고, `patterns/viewport-shell/sticky-header.md`는 검토 후 미채택(정적 헤더: 포커스 가림 위험이 없고 인쇄물 느낌에 맞음).
- Lazyweb: 건너뜀 — 방향이 브리프로 고정되어 탐색 lane이 불필요.
- Imagen drafts: 건너뜀 — 구체적인 토큰 값이 브리프에 주어져 참조 이미지가 필요 없음.
- Motion: StyleGallery `motion/techniques/scroll-choreography.md`의 "Load as enhancement" 패턴(숨김 상태는 `.motion` 클래스 뒤에만 존재)을 채택. GSAP/Lenis 없이 IntersectionObserver + CSS transition으로 구현.
- 결과 검사 기준: StyleGallery `showcase/README.md`의 outcome checks(320/768/1440 가로 넘침 없음, 포커스 가시성·DOM 순서, reduced-motion, WCAG AA 대비, 빈 `#` 링크 없음, title + favicon).

## 1. 분위기와 정체성

잘 만든 독립 잡지 한 권. 오프화이트 종이 위에 무거운 그로테스크 디스플레이, 잉크색 본문, 채도 높은 스팟 컬러 하나, 눈에 보이는 괘선(hairline). 표면은 평평하고(그림자 없음, 모서리 거의 없음) 깊이는 종이색 두 단계(`--paper`, `--paper-2`)의 톤 차이로만 만든다.

시그니처: 홈 히어로의 거대한 `floweredao` 워드마크(Bricolage Grotesque 800, 자간 -0.05em, 행간 0.85)와 그 위에 놓인 모노 라벨 + 괘선. 64rem 이상에서는 본문 영역 뒤로 12칸 괘선 그리드가 비친다. 카드와 읽기 단은 불투명한 종이색이라 그리드 선을 가리고, 선은 여백에서만 보인다.

## 2. 색

| 역할 | 토큰 | 값 | 용도 |
| --- | --- | --- | --- |
| 종이 | `--paper` | `#f4efe6` | 페이지 배경, 읽기 단 배경, 스팟 위 글자 |
| 종이 2 | `--paper-2` | `#ebe4d6` | 카드·패널·코드 블록 배경 |
| 잉크 | `--ink` | `#141210` | 본문, 제목, 기본 버튼 테두리 |
| 잉크(흐림) | `--ink-dim` | `rgb(20 18 16 / 0.64)` | 보조 텍스트, 날짜, 요약, 라벨 |
| 잉크(연함) | `--ink-soft` | `rgb(20 18 16 / 0.5)` | 코드 주석 |
| 괘선 | `--rule` | `rgb(20 18 16 / 0.18)` | 모든 구분선, 라벨 위 hairline, 그리드 선 |
| 잉크 워시 | `--ink-wash` | `rgb(20 18 16 / 0.06)` | 보조 버튼·태그 hover 워시 |
| 스팟 | `--spot` | `#1f4bff` | 링크 hover, 포커스 링, 주 버튼 배경, 공개 배지 점, 텍스트 선택 |
| 스팟 위 글자 | `--on-spot` | `#f4efe6` | 스팟 배경 위 텍스트 |

측정한 대비: ink/paper 16.6:1, ink-dim/paper-2 ≈ 5.1:1(AA), spot/paper 5.2:1(AA), on-spot/spot 6.0:1(AA).

규칙:
- 스팟은 한 화면에 한두 곳. 장식에는 쓰지 않는다.
- 선택/활성 상태는 색 테두리가 아니라 잉크 워시, 밑줄, 글리프(배지의 네모)로 표현한다. 색 테두리는 키보드 포커스 링(`:focus-visible`)에만 허용한다.
- `<meta name="theme-color">`는 `--paper` 값(`#f4efe6`)을 그대로 적는다(메타데이터라 CSS 변수를 못 쓴다).

## 3. 타이포그래피

서체:
- `--font-sans`: `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif` — 한국어 본문과 UI. jsDelivr의 Pretendard 가변 동적 서브셋(`font-display: swap`).
- `--font-display`: `"Bricolage Grotesque", var(--font-sans)` — 라틴 디스플레이(Google Fonts, opsz 12–96 / wght 500–800). 한글은 Pretendard로 폴백한다.
- `--font-mono`: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` — 라벨, 색인 번호, 코드, 기술 태그.

| 단계 | 토큰 | 크기 | 굵기 | 행간 | 자간 | 용도 |
| --- | --- | --- | --- | --- | --- | --- |
| 워드마크 | `--text-wordmark` | `clamp(2.75rem, 12vw, 12.5rem)` | 800 | 0.85 | -0.05em | 홈 히어로 `floweredao` |
| 디스플레이 | `--text-display` | `clamp(2.5rem, 7vw, 5.5rem)` | 800 | 0.95 | -0.03em | 목록 페이지 제목, 홈 섹션 제목 |
| 헤드라인 | `--text-headline` | `clamp(2rem, 5vw, 4rem)` | 800 | 1.05 | -0.02em | 글·작업물 상세 제목 |
| h2 | `--text-h2` | `clamp(1.5rem, 3vw, 2.25rem)` | 700 | 1.15 | -0.02em | 상세 페이지 안 섹션 제목(주요 기능, 화면, 사용 기술) |
| 타이틀 | `--text-title` | `clamp(1.375rem, 2.5vw, 1.75rem)` | 700 | 1.25 | -0.01em | 목록 항목 제목, 카드 제목, 본문 h2 |
| h3 | `--text-h3` | `1.25rem` | 700 | 1.35 | -0.01em | 기능 카드 제목, 본문 h3 |
| 리드 | `--text-lead` | `clamp(1.125rem, 1.5vw, 1.375rem)` | 400 | 1.6 | 0 | 태그라인, 페이지 소개, 글 요약 |
| 본문(읽기) | `--text-body` | `1.125rem` | 400 | 1.75 | 0 | 마크다운 본문 |
| UI | `--text-ui` | `1rem` | 400 | 1.6 | 0 | 카드 요약, 메타, 내비게이션 |
| 작게 | `--text-small` | `0.875rem` | 400 | 1.5 | 0 | 캡션, 날짜, 태그, 코드 블록 |
| 라벨 | `--text-label` | `0.75rem` | 500 | 1.4 | 0.1em | 모노 라벨(대문자), 위에 hairline |

규칙:
- 한국어 제목은 `word-break: keep-all`, 본문은 `keep-all` + `overflow-wrap: anywhere`(긴 URL이 가로 넘침을 만들지 않게).
- 읽기 폭 `--measure: 40rem`. Warm Print의 34rem은 라틴 세리프 기준이라 한국어 글자폭에 맞춰 넓혔고, 소개 문단은 `--measure-narrow: 34rem`을 쓴다.
- 본문 글자는 `--text-small`(14px) 아래로 내려가지 않는다. 라벨(12px)은 모노 대문자 라틴에만 쓴다.
- 서체는 셋(sans, display, mono). 세리프는 쓰지 않는다.

## 4. 간격과 레이아웃

기본 단위 4px.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--space-1` | 0.25rem | 아이콘-라벨 사이 |
| `--space-2` | 0.5rem | 배지 점, 태그 안쪽, 목록 항목 사이 |
| `--space-3` | 0.75rem | 라벨 아래 hairline 간격, 버튼 세로 |
| `--space-4` | 1rem | 메타 행 간격 |
| `--space-5` | 1.25rem | 카드 안쪽, 그리드 gap, 본문 문단 사이 |
| `--space-6` | 1.5rem | 패널 안쪽, 헤더 세로 |
| `--space-8` | 2rem | 블록 사이 |
| `--space-10` | 2.5rem | 푸터 세로, 워드마크 아래 |
| `--space-12` | 3rem | 섹션 위쪽, 본문 h2 위 |
| `--space-16` | 4rem | 섹션 아래쪽, 히어로 위 |
| `--space-20` | 5rem | 히어로 아래, 페이지 끝 |
| `--space-24` | 6rem | 최대 섹션 간격 |

레이아웃:
- `--gutter: clamp(1rem, 3vw, 2.5rem)`, `--content-max: 72rem`. 모든 페이지 블록은 `.container`(`inline-size: min(100% - 2 * var(--gutter), var(--content-max))`) 안에 놓인다.
- 12칸 괘선 그리드(`.site_main_lines`)는 64rem 이상에서만 보이고, 컨테이너와 같은 수식으로 폭을 맞춰 선이 콘텐츠 가장자리와 일치한다.
- 카드 그리드: `repeat(auto-fill, minmax(min(20rem, 100%), 1fr))` — 320px에서 1단, 768px에서 2단, 1152px 컨테이너에서 3단. 항목이 하나여도 늘어나지 않는다.
- 2단 읽기 레이아웃(글 상세): 64rem 이상에서 12칸 그리드 위에 보조 단(1–3칸, sticky) + 본문(4–12칸). 작업물 상세 본문은 같은 그리드에서 4번째 칸부터 시작해(`.offset_3`) 왼쪽 여백을 비운다.
- 브레이크포인트: `48rem`(목록 항목 2단, 이전/다음 3단), `64rem`(그리드 선, 보조 단).
- `--control-size: 2.75rem`(44px) — 버튼 최소 높이.

## 5. 컴포넌트

### SiteHeader
- 구조: `header > div.container > a(브랜드) + nav > ul > li > a`
- 상태: 기본(ink-dim), hover(ink), 현재 섹션(`aria-current="page"`: ink + 1px 밑줄)
- 접근성: `nav[aria-label="주 메뉴"]`, 현재 섹션에 `aria-current`
- 레이아웃: wrap-row, 아래 hairline. 정적(비 sticky)

### SiteFooter
- 구조: `footer > div.container > p(저작권, 모노) + ul(링크)`
- 링크: GitHub 프로필, 블로그, 포트폴리오. 밑줄 1px, hover 스팟

### Eyebrow(라벨)
- 구조: `p.eyebrow`(위 hairline + 모노 대문자 라벨). 라틴 텍스트만(IBM Plex Mono에는 한글이 없다)
- 모션: `data-reveal`을 넘기면 등장 모션 대상

### PageHeader / SectionHead
- PageHeader: Eyebrow + `h1`(display) + 소개 문단(lead, measure-narrow). 목록 페이지와 404
- SectionHead: Eyebrow + `h2`(display 또는 h2 크기) + 선택적 "전체 보기 →" 링크. 홈 섹션과 상세 페이지 섹션

### Button(링크 버튼)
- 구조: `a.button[data-variant]`
- 변형: primary(스팟 배경 + on-spot 글자), secondary(ink 1px 테두리, 투명 배경)
- 상태: hover(primary → ink 배경, secondary → ink-wash), focus-visible(스팟 링)
- 크기: 최소 높이 `--control-size`, 반경 `--radius-sm`
- 용도: 작업물의 외부 링크(첫 링크만 primary)

### Badge(공개 여부)
- 구조: `span.badge[data-visibility]` + `::before` 네모 글리프
- 변형: public(스팟 채운 네모, "공개 저장소"), private(ink-dim 테두리 빈 네모, "비공개 프로젝트")

### WorkCard
- 구조: `article.work_card > div.work_card_media(img) + div.work_card_body(메타, h3 > a, 요약, footer: Badge + 화살표)`
- 상태: hover(제목 스팟, 화살표 이동), focus-visible(카드 전체 스팟 링), 이미지 없음(paper-2 프레임)
- 접근성: 링크 이름 = 제목. 카드 전체 클릭은 `a::after` 스트레치로 처리해 링크 텍스트가 길어지지 않는다
- 레이아웃: 16:10 이미지 프레임(`object-fit: cover`), paper-2 패널, 반경 0
- 모션: 홈·목록에서 `li[data-reveal]`로 스태거 등장

### PostList
- 구조: `ul.post_list > li(날짜 + 본문: h2/h3 > a, 설명, 태그)`
- 상태: 제목 hover 스팟
- 레이아웃: 항목 위 hairline. 48rem 이상에서 날짜(왼쪽 고정 폭) + 본문 2단

### MetaList
- 구조: `dl.meta_list > div > dt + dd` (대상, 플랫폼, 연도, 공개 여부)
- 레이아웃: 위 hairline, auto-fit 그리드

### FeatureGrid / Gallery / TagList
- FeatureGrid: `ol > li`(paper-2 패널, 모노 색인 01·02…, h3, 본문)
- Gallery: `ul > li > figure(img[loading=lazy][decoding=async] + figcaption)`; 이미지 폭·높이는 빌드 시 파일에서 읽어 넣어 CLS를 막는다
- TagList: `ul > li`(hairline 테두리, 모노)

### PrevNext
- 구조: `nav[aria-label="이웃 항목"] > 이전 링크 + 목록으로 + 다음 링크`
- 레이아웃: 48rem 이상 3단(1fr auto 1fr), 아래에서는 세로 stack. 항목 라벨은 ink-dim 작은 글자

### Prose(마크다운 본문)
- 구조: `div.prose` 안에 `<Content />`
- 규칙: 폭 `--measure`, 불투명 paper 배경(그리드 선 가림), h2 위 hairline, 링크 밑줄 1px + hover 스팟, 코드 블록 paper-2, 표는 가로 스크롤, 이미지 `max-inline-size: 100%`

## 6. 모션

| 종류 | 시간 | 이징 | 용도 |
| --- | --- | --- | --- |
| 마이크로 | `--dur-micro` 150ms | ease-out | 링크 색, 버튼 워시, 카드 화살표 이동 |
| 등장 | `--dur-enter` 700ms | `--ease-out` `cubic-bezier(0.22, 1, 0.36, 1)` | 히어로 줄 단위 등장(`--stagger` 80ms), 섹션 제목·카드 진입 등장 |

규칙:
- `transform`과 `opacity`만 애니메이션한다.
- 숨김 상태(`opacity: 0; translateY(1rem)`)는 `html.motion` 뒤에만 존재한다. `.motion`은 JS가 실행되고 `prefers-reduced-motion: reduce`가 아닐 때만 붙는다 → JS가 없거나 동작 줄이기가 켜져 있으면 모든 글이 처음부터 보인다.
- 등장은 IntersectionObserver로 한 번만 실행하고, 스크롤 리스너와 무한 애니메이션은 없다. 한 페이지에 등장 그룹은 3–5개.
- hover는 상태 변화가 있는 요소(링크, 카드, 버튼)에만 있다.

## 7. 깊이와 표면

전략: 평면 + 괘선(borders-only). `box-shadow` 0. 패널은 `--paper-2` 톤 차이로만 구분한다.

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `--radius-sm` | 0.125rem | 버튼, 배지, 태그, 인라인 코드 |
| (없음) | 0 | 카드, 이미지, 패널, 코드 블록 |

규칙: 중첩 모서리 없음(모두 0 또는 2px). 테두리는 `1px solid var(--rule)` 또는 버튼의 `1px solid var(--ink)`뿐이다.

## 8. 접근성 제약과 수용한 부채

제약:
- WCAG 2.2 AA: 본문 4.5:1, 큰 글자 3:1. 위 표의 대비는 모두 측정값.
- 모든 상호작용 요소에 `:focus-visible` 스팟 링(2px, offset 3px). skip link는 포커스 시 보인다.
- `aria-current`로 현재 섹션 표시, 모든 `img`에 콘텐츠의 alt, 섹션은 `aria-labelledby`.
- `prefers-reduced-motion: reduce`에서 등장 모션·부드러운 스크롤 비활성.
- 320px에서 가로 스크롤 없음: 이미지 `max-inline-size: 100%`, 긴 URL은 `overflow-wrap: anywhere`, 코드 블록·표는 자체 가로 스크롤.

수용한 부채:

| 항목 | 위치 | 이유 | 해소 |
| --- | --- | --- | --- |
| 외부 폰트 CDN(jsDelivr, Google Fonts)이 막히면 시스템 서체로 보인다 | `BaseLayout.astro` | 폰트 자산 셀프호스팅은 이번 범위 밖 | 필요 시 `public/fonts/`로 옮기고 `@font-face`를 `src/styles/`에 둔다 |
| Bricolage Grotesque(라틴)와 Pretendard(한글)가 한 제목에 섞이면 x-height가 다르다 | 제목 전반 | Warm Print의 디스플레이 서체를 유지하기 위해 수용 | 라틴 제목 비중이 커지면 Pretendard 단일 서체로 바꿔 평가 |
| 이미지 파일이 빌드 시점에 없으면 `width/height`가 빠져 CLS가 생길 수 있다 | `src/lib/image-size.ts` | 콘텐츠 작성과 빌드가 분리되어 있어 빌드를 막지 않는다(경고만 출력) | 이미지를 추가하면 자동으로 해소 |
