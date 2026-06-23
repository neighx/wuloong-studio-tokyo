import Image from "next/image"

export default function Hero() {
  return (
    <>
      {/* ── スタジオ写真 ─────────────────────────────────────────────── */}
      <div className="mt-[60px] lg:mt-[120px] px-3 sm:px-5 lg:px-10">
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "72vh",
            maxHeight: 860,
            minHeight: 380,
            borderRadius: "4px",
          }}
        >
          <Image
            src="/images/studio/studio-main.jpg"
            alt="Wuloong Studio TOKYO — スタジオ"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width:640px) 100vw, 95vw"
          />
        </div>
      </div>

      {/* ── ホワイト エディトリアルセクション (Ron Herman スタイル) ──── */}
      <div className="bg-white text-center" style={{ padding: "6rem 2rem 3rem" }}>

        {/* 日本語タグライン */}
        <p
          className="text-[#1a2340]"
          style={{
            fontSize: "clamp(1.15rem, 2.8vw, 2rem)",
            fontWeight: 300,
            letterSpacing: "0.12em",
            lineHeight: 2.1,
            marginBottom: "3rem",
          }}
        >
          その一瞬を、永遠の記憶に。
        </p>

        {/* What We Do テキスト — Ron Herman 中央エディトリアルスタイル */}
        <div style={{ maxWidth: "600px", margin: "0 auto 4rem" }}>
          <p
            className="text-[#1a2340]"
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
              fontWeight: 500,
              letterSpacing: "0.05em",
              lineHeight: 2.0,
              marginBottom: "1.8rem",
              fontStyle: "italic",
            }}
          >
            &ldquo;3時間でアイデアを、リリースできる1曲に変える場所。&rdquo;
          </p>
          <p
            className="text-[#64748b]"
            style={{
              fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
              lineHeight: 2.1,
              letterSpacing: "0.02em",
              marginBottom: "1.2rem",
            }}
          >
            宅録の音質に限界を感じていたり、スタジオに入ることへのハードルを感じていても大丈夫。
            録音からMIX・マスタリングまで、1曲を仕上げる全工程をサポートします。
          </p>
          <p
            className="text-[#64748b]"
            style={{
              fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)",
              lineHeight: 2.1,
              letterSpacing: "0.02em",
            }}
          >
            初めての方でも、プロのアーティストでも。あなたのやりたいことに合わせて対応します。
          </p>
        </div>

        {/* VOCAL IS BEAUTIFUL — Ron Herman「Style of Life California」スタイル */}
        <h1
          className="text-[#1a2340] font-black uppercase leading-none"
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.6rem)",
            letterSpacing: "0.1em",
            marginBottom: "2.5rem",
          }}
        >
          VOCAL IS BEAUTIFUL
        </h1>

        {/* Wuloong Studio 署名ロゴ */}
        <div
          className="flex justify-center"
          style={{ marginBottom: "3.5rem" }}
        >
          <Image
            src="/images/logo/logo.png"
            alt="Wuloong Studio"
            width={373}
            height={160}
            style={{
              height: "clamp(28px, 3.2vw, 40px)",
              width: "auto",
              filter: "brightness(0)",
              opacity: 0.6,
            }}
          />
        </div>

      </div>
    </>
  )
}
