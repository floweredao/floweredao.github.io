#!/usr/bin/env python3
"""Offline checks for the static site: HTML parses, and internal links/assets resolve."""
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {".git", ".github"}
ATTRS = {"href", "src", "poster", "data-src"}


class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        for k in ATTRS:
            if a.get(k):
                self.refs.append(a[k])
        if a.get("srcset"):
            for part in a["srcset"].split(","):
                if part.strip():
                    self.refs.append(part.split()[0])


def resolve(page, ref):
    """Return the target Path for an internal reference, or None if external/ignored."""
    u = urlsplit(ref.strip())
    if u.scheme or u.netloc or not u.path:
        return None
    path = unquote(u.path)
    base = ROOT / path.lstrip("/") if path.startswith("/") else page.parent / path
    base = Path(*base.parts)
    candidates = [base, base / "index.html"] if (path.endswith("/") or base.is_dir()) else [base]
    for c in candidates:
        if c.is_file():
            return c
    return False


def main():
    errors = []
    pages = sorted(p for p in ROOT.rglob("*.html") if not SKIP_DIRS & set(p.relative_to(ROOT).parts))
    if not (ROOT / "index.html").is_file():
        errors.append("index.html is missing")
    for page in pages:
        rel = page.relative_to(ROOT)
        c = Collector()
        try:
            c.feed(page.read_text(encoding="utf-8"))
            c.close()
        except Exception as e:  # parser or decoding failure
            errors.append(f"{rel}: cannot parse: {e}")
            continue
        for ref in c.refs:
            target = resolve(page, ref)
            if target is False:
                errors.append(f"{rel}: broken internal reference {ref!r}")
    print(f"checked {len(pages)} HTML files")
    for e in errors:
        print("ERROR:", e)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
