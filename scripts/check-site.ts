import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const dist = join(import.meta.dir, "..", "dist");
const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

const required = [
  "index.html",
  "blog/index.html",
  "blog/hello/index.html",
  "portfolio/index.html",
  "portfolio/speech2text/index.html",
  "portfolio/label-automation/index.html",
];
for (const file of required) {
  if (!existsSync(join(dist, file))) fail(`필수 페이지 없음: ${file}`);
}

const resolves = (path: string) => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  const target = join(dist, clean);
  if (!existsSync(target)) return false;
  return statSync(target).isDirectory() ? existsSync(join(target, "index.html")) : true;
};

const forbidden = [
  /\/Users\//,
  /C:\\/,
  /[\w.+-]+@(gmail|naver|daum|hanmail|kakao)\.com/i,
  /KindMeatShop_LAFX/,
  /github\.com\/floweredao\/KindMeatShop/i,
];
let pages = 0;
let links = 0;
let images = 0;

for (const rel of new Bun.Glob("**/*.html").scanSync({ cwd: dist })) {
  pages++;
  const html = await Bun.file(join(dist, rel)).text();
  for (const pattern of forbidden) {
    if (pattern.test(html)) fail(`${rel}: 금지된 문자열 ${pattern}`);
  }
  for (const [, attr, value] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    if (attr === "href" && (value === "" || value === "#")) {
      fail(`${rel}: 빈 링크 href="${value}"`);
      continue;
    }
    if (value.startsWith("/") && !value.startsWith("//")) {
      links++;
      if (!resolves(value)) fail(`${rel}: 해결되지 않는 링크 ${value}`);
    }
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
    images++;
    const alt = tag.match(/\salt="([^"]*)"/);
    if (!alt || alt[1].trim() === "") fail(`${rel}: alt 없는 이미지 ${tag.slice(0, 120)}`);
  }
}

console.log(`페이지 ${pages}개, 내부 링크 ${links}개, 이미지 ${images}개 점검`);
if (failures.length > 0) {
  for (const f of failures) console.log(`FAIL ${f}`);
  process.exit(1);
}
console.log("PASS 필수 페이지, 내부 링크, 대체 텍스트, 비공개 문자열");
