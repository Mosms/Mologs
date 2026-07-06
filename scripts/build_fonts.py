#!/usr/bin/env python3
"""Build reproducible, browser-safe Chinese webfont subsets for Mologs."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = ROOT / "assets" / "fonts"
MANIFEST = FONT_DIR / "font-manifest.json"

CONTENT_SUFFIXES = {".html", ".md", ".yml", ".yaml"}
SKIP_PARTS = {".git", "_site", "vendor", "node_modules", "assets", ".jekyll-cache"}
PROFILE_SOURCES = [
    ROOT / "_config.yml",
    ROOT / "_layouts" / "home.html",
    ROOT / "_includes" / "site-header.html",
    ROOT / "index.html",
]
DROP_TABLES = {"vhea", "vmtx", "VDMX", "LTSH", "hdmx", "kern", "DSIG"}
REQUIRED_OUTLINE_TABLES = {"OS/2", "cmap", "glyf", "head", "hhea", "hmtx", "loca", "maxp", "name", "post"}
CJK_RANGES = (
    (0x2E80, 0x2EFF),
    (0x3000, 0x303F),
    (0x31C0, 0x31EF),
    (0x3400, 0x4DBF),
    (0x4E00, 0x9FFF),
    (0xF900, 0xFAFF),
    (0xFF00, 0xFFEF),
)

FONTS = {
    "noto-serif-sc-site-v1": {
        "source": FONT_DIR / "noto-serif-sc-full.ttf",
        "output": FONT_DIR / "noto-serif-sc-site-v1.woff2",
        "scope": "site",
    },
    "qingniao-jiankai-site-v1": {
        "source": FONT_DIR / "qingniao-jiankai-full.ttf",
        "output": FONT_DIR / "qingniao-jiankai-site-v1.woff2",
        "scope": "site",
    },
    "liu-gong-quan-profile-v1": {
        "source": FONT_DIR / "liu-gong-quan-full.ttf",
        "output": FONT_DIR / "liu-gong-quan-profile-v1.woff2",
        "scope": "profile",
    },
}


def is_cjk_web_char(char: str) -> bool:
    value = ord(char)
    return any(start <= value <= end for start, end in CJK_RANGES)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="strict")


def site_sources() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*")
        if path.is_file()
        and path.suffix.lower() in CONTENT_SUFFIXES
        and not any(part in SKIP_PARTS for part in path.relative_to(ROOT).parts)
    )


def collect_chars(paths: list[Path]) -> str:
    text = "".join(read_text(path) for path in paths if path.exists())
    chars = {char for char in text if is_cjk_web_char(char)}
    # Keep the punctuation used by generated UI labels even when Liquid supplies it.
    chars.update("，。！？：；、（）《》〈〉【】“”‘’—…·　")
    return "".join(sorted(chars, key=ord))


def repair_broken_glyph_order(font: TTFont) -> None:
    """Remove phantom glyph-order entries that have no glyf record."""
    if "glyf" not in font:
        return
    glyf_names = set(font["glyf"].glyphs)
    order = font.getGlyphOrder()
    valid_order = [name for name in order if name in glyf_names]
    if len(valid_order) == len(order):
        return
    font.setGlyphOrder(valid_order)
    font["maxp"].numGlyphs = len(valid_order)
    if "hmtx" in font:
        font["hmtx"].metrics = {
            name: metrics for name, metrics in font["hmtx"].metrics.items() if name in glyf_names
        }


def build_subset(source: Path, output: Path, characters: str) -> dict[str, object]:
    font = TTFont(source, recalcTimestamp=False)
    repair_broken_glyph_order(font)

    options = subset.Options()
    options.flavor = "woff2"
    options.drop_tables = sorted(DROP_TABLES)
    options.layout_features = ["*"]
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 16, 17]
    options.name_legacy = True
    options.name_languages = [0x409, 0x804]
    options.notdef_glyph = True
    options.notdef_outline = True
    options.recommended_glyphs = True

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(text=characters)
    subsetter.subset(font)
    for table in DROP_TABLES:
        if table in font:
            del font[table]
    font.flavor = "woff2"
    font.save(output, reorderTables=True)

    check = TTFont(output)
    cmap = check.getBestCmap() or {}
    missing = [char for char in characters if ord(char) not in cmap]
    if missing:
        preview = "".join(missing[:20])
        raise RuntimeError(f"{output.name} is missing required characters: {preview!r}")

    return {
        "source": source.name,
        "output": output.name,
        "characters": len(characters),
        "glyphs": check["maxp"].numGlyphs,
        "bytes": output.stat().st_size,
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "tables": sorted(check.keys()),
    }


def audit_font(path: Path) -> dict[str, object]:
    font = TTFont(path)
    tables = set(font.keys())
    missing_tables = sorted(REQUIRED_OUTLINE_TABLES - tables)
    if missing_tables:
        raise RuntimeError(f"{path.name} is missing required tables: {missing_tables}")
    return {
        "bytes": path.stat().st_size,
        "glyphs": font["maxp"].numGlyphs,
        "cmap_entries": len(font.getBestCmap() or {}),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "tables": sorted(tables),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify outputs without rebuilding")
    args = parser.parse_args()

    scopes = {
        "site": collect_chars(site_sources()),
        "profile": collect_chars(PROFILE_SOURCES),
    }
    results: dict[str, object] = {}

    for name, config in FONTS.items():
        source = config["source"]
        output = config["output"]
        characters = scopes[config["scope"]]
        if not source.exists():
            raise FileNotFoundError(source)
        if args.check:
            if not output.exists():
                raise FileNotFoundError(output)
            font = TTFont(output)
            cmap = font.getBestCmap() or {}
            missing = [char for char in characters if ord(char) not in cmap]
            if missing:
                raise RuntimeError(f"{output.name} needs rebuilding; missing {''.join(missing[:20])!r}")
            results[name] = {
                "characters": len(characters),
                "glyphs": font["maxp"].numGlyphs,
                "bytes": output.stat().st_size,
                "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
                "tables": sorted(font.keys()),
            }
        else:
            results[name] = build_subset(source, output, characters)

    inventory = {
        path.name: audit_font(path)
        for path in sorted([*FONT_DIR.glob("*.woff2"), *FONT_DIR.glob("*.ttf")])
    }
    report = {"generated": results, "inventory": inventory}
    if not args.check:
        MANIFEST.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
