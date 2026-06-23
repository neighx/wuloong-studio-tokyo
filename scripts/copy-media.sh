#!/bin/bash
# ─────────────────────────────────────────────────────────
# Wuloong Studio TOKYO — メディアコピースクリプト
# Dropboxの「ウーロン」フォルダからpublicへ必要ファイルをコピー
#
# 使い方:
#   chmod +x scripts/copy-media.sh
#   bash scripts/copy-media.sh
# ─────────────────────────────────────────────────────────

SRC="/Users/ishikawaryutaro/Library/CloudStorage/Dropbox/ウーロン"
DEST="$(dirname "$0")/.."
PUBLIC="$DEST/public"

echo "🎙  Wuloong Studio — メディアコピー開始"
echo ""

# ── ファイルサイズ確認 (0B = まだダウンロードされていない)
check_file() {
  local f="$1"
  local size
  size=$(wc -c < "$f" 2>/dev/null || echo 0)
  if [ "$size" -eq 0 ]; then
    echo "  ⚠️  未ダウンロード: $f"
    echo "     → Finderで右クリック →「このデバイスで使用可能にする」"
    return 1
  fi
  return 0
}

copy_if_ready() {
  local src="$1"
  local dst="$2"
  if [ -f "$src" ]; then
    if check_file "$src"; then
      cp "$src" "$dst"
      echo "  ✅  $(basename "$src") → $dst"
    fi
  else
    echo "  ❌  ファイルが見つかりません: $src"
  fi
}

# ── ディレクトリ作成
mkdir -p "$PUBLIC/video"
mkdir -p "$PUBLIC/images/studio"
mkdir -p "$PUBLIC/images/logo"
mkdir -p "$PUBLIC/images/map"

echo "▶ 動画ファイル"
copy_if_ready "$SRC/DanielAllan_WuloongStudio.mp4"          "$PUBLIC/video/hero.mp4"
copy_if_ready "$SRC/DanielAllan_WuloongStudioiphone.mp4"    "$PUBLIC/video/hero-mobile.mp4"
copy_if_ready "$SRC/音楽撮影/TRS_0006.mov"                  "$PUBLIC/video/studio-session1.mov"
copy_if_ready "$SRC/音楽撮影/TRS_0009.mov"                  "$PUBLIC/video/studio-session2.mov"
copy_if_ready "$SRC/音楽撮影/TRS_0010.mov"                  "$PUBLIC/video/studio-session3.mov"

echo ""
echo "▶ 写真 — 加工済み (サイトのギャラリー用)"
copy_if_ready "$SRC/写真/加工ずみ/DSC09126.jpg"             "$PUBLIC/images/studio/studio1.jpg"
copy_if_ready "$SRC/写真/加工ずみ/DSC09131.jpg"             "$PUBLIC/images/studio/studio2.jpg"
copy_if_ready "$SRC/写真/加工ずみ/DSC09134.jpg"             "$PUBLIC/images/studio/studio3.jpg"
copy_if_ready "$SRC/写真/加工ずみ/DSC09081.jpg"             "$PUBLIC/images/studio/studio4.jpg"
copy_if_ready "$SRC/写真/加工ずみ/DSC09089-3.jpg"           "$PUBLIC/images/studio/studio5.jpg"
copy_if_ready "$SRC/写真/加工ずみ/DSC09074-2.jpg"           "$PUBLIC/images/studio/studio6.jpg"
copy_if_ready "$SRC/音楽撮影/DSC09200.JPG"                  "$PUBLIC/images/studio/session1.jpg"
copy_if_ready "$SRC/音楽撮影/DSC09567.JPG"                  "$PUBLIC/images/studio/session2.jpg"

echo ""
echo "▶ ロゴ"
copy_if_ready "$SRC/ロゴ/wuloonglogovoice-02.png"           "$PUBLIC/images/logo/logo-white.png"
copy_if_ready "$SRC/ロゴ/wuloonglogovoice-04.png"           "$PUBLIC/images/logo/logo-dark.png"
copy_if_ready "$SRC/ロゴ/wuloonglogo白1-03.png"             "$PUBLIC/images/logo/logo-alt1.png"
copy_if_ready "$SRC/ロゴ/永遠の記憶.png"                    "$PUBLIC/images/logo/tagline.png"

echo ""
echo "▶ 地図"
copy_if_ready "$SRC/地図.png"                               "$PUBLIC/images/map/map.png"
copy_if_ready "$SRC/地図2.png"                              "$PUBLIC/images/map/map2.png"

echo ""
echo "─────────────────────────────────────"
echo "✅ コピー完了"
echo ""
echo "次のステップ:"
echo "  1. Hero動画: public/video/hero.mp4 が入っていれば"
echo "     components/Hero.tsx の <HeroVideo /> コメントを外す"
echo "  2. 写真が入っていれば npm run dev で確認"
echo "─────────────────────────────────────"
