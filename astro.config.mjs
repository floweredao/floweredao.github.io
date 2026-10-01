// @ts-check
import { defineConfig } from 'astro/config';

// 배포 대상: GitHub Pages 사용자 사이트(https://floweredao.github.io, 루트 경로).
// 빌드 결과(dist/)를 gh-pages 브랜치에 그대로 올립니다. README.md의 "배포" 항목 참고.
export default defineConfig({
  site: 'https://floweredao.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  // Astro 7 기본값('jsx')은 인라인 요소 사이의 공백을 지웁니다.
  // 한국어 본문처럼 인라인 요소 사이 공백이 의미를 가지는 마크업을 위해 HTML 규칙 압축을 사용합니다.
  compressHTML: true,
  markdown: {
    shikiConfig: {
      // 코드 블록 색을 디자인 토큰(src/styles/tokens.css의 --astro-code-*)으로 제어합니다.
      theme: 'css-variables',
    },
  },
});
