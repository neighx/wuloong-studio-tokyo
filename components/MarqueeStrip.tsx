const items = [
  "WULOONG STUDIO TOKYO",
  "三軒茶屋",
  "完全予約制",
  "HIPHOP",
  "R&B",
  "VOCAL RECORDING",
  "初心者大歓迎",
  "1曲完成サポート",
  "世田谷",
  "TOKYO PRIVATE STUDIO",
  "Neumann TLM 103",
  "Logic Pro",
]

export default function MarqueeStrip() {
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#06070a",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="flex whitespace-nowrap py-3.5"
        style={{ animation: "marquee-scroll 32s linear infinite" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span
              className="px-5 text-[10px] font-semibold tracking-[0.38em] uppercase"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              {item}
            </span>
            <span style={{ color: "rgba(107,159,212,0.45)", fontSize: "0.55rem" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
