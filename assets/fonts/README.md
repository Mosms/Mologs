# Local webfonts

All production fonts are served locally; no font CDN is used.

## Runtime files

- `crimson-pro*.woff2`: English body text, including the CJK optical-size alias.
- `ubuntu-mono.woff2`: dates, labels, metadata, and other monospace information.
- `noto-serif-sc-site-v1.woff2`: Chinese body subset generated from all site content.
- `qingniao-jiankai-site-v1.woff2`: Chinese heading subset generated from all site content.
- `liu-gong-quan-profile-v1.woff2`: small critical subset generated from branding/home templates.

## Source and fallback files

The three `*-full.ttf` files are retained as reproducible subset sources and as the second
`src` fallback when a browser rejects a WOFF2 file. They should not normally be downloaded.

Run the scanner and subset builder whenever templates or Markdown content changes:

```powershell
$env:PYTHONPATH = "path-to-fonttools"
python .\scripts\build_fonts.py
python .\scripts\build_fonts.py --check
```

The generated `font-manifest.json` records glyph counts, table lists, sizes, and SHA-256 hashes.

## Licences

- Crimson Pro and Noto Serif SC use the SIL Open Font License; copies are in `licenses/`.
- Ubuntu Mono uses the Ubuntu Font Licence; a copy is in `licenses/`.
- Liu Gong Quan and Qingniao JianKai are custom/commercial Chinese fonts retained only for
  this owner's sites. Their presence does not grant redistribution, modification, or reuse
  rights. The owner must confirm that public Web embedding and repository redistribution are
  permitted. The generator does not modify font embedding-permission bits.
