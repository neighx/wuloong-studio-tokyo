"use client"

/**
 * Hero背景に動画を使う場合のコンポーネント
 *
 * 軽量化のポイント:
 *   - autoPlay muted loop playsInline  → ブラウザが自動で最適化
 *   - poster={画像URL}                → 動画ロード前に静止画を表示
 *   - preload="none"                  → スクロール前はロードしない
 *   - WebM優先 → MP4フォールバック     → WebMはMP4より30-50%軽い
 *   - ffmpegで圧縮すること (下記参照)
 *
 * 動画ファイルの推奨サイズ:
 *   - 解像度: 1280×720 (720p) で十分。1920は重い
 *   - ファイルサイズ: 5MB以下を目標
 *   - 長さ: 10〜20秒のループ
 *
 * ffmpegで圧縮するコマンド例:
 *   ffmpeg -i original.mp4 \
 *     -vf "scale=1280:-2" \
 *     -c:v libx264 -crf 28 -preset slow \
 *     -an \
 *     -movflags +faststart \
 *     hero.mp4
 *
 *   ffmpeg -i original.mp4 \
 *     -vf "scale=1280:-2" \
 *     -c:v libvpx-vp9 -crf 35 -b:v 0 \
 *     -an \
 *     hero.webm
 *
 * 使い方:
 *   Hero.tsx の <section> の先頭に <HeroVideo /> を貼るだけ。
 *   動画ファイルは /public/video/ に置く。
 */

interface HeroVideoProps {
  /** /public/video/hero.mp4 など */
  mp4Src?: string
  /** /public/video/hero.webm など (WebMの方が軽い) */
  webmSrc?: string
  /** 動画ロード前に表示する静止画 */
  poster?: string
  /** 0〜1 の透明度で背景を暗くする (default: 0.55) */
  overlayOpacity?: number
}

export default function HeroVideo({
  mp4Src = "/video/hero.mp4",
  webmSrc = "/video/hero.webm",
  poster = "/video/hero-poster.jpg",
  overlayOpacity = 0.55,
}: HeroVideoProps) {
  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
      >
        {/* WebMを先に → 非対応ブラウザはMP4 */}
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src}  type="video/mp4" />
      </video>

      {/* 暗めのオーバーレイで文字を読みやすく */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `rgba(10,14,26,${overlayOpacity})` }}
      />
    </>
  )
}
