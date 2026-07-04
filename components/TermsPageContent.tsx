"use client"

import { useLang } from "@/contexts/LanguageContext"

const content = {
  ja: {
    eyebrow: "TERMS OF SERVICE",
    title: "利用規約",
    lastUpdated: "最終更新日：2025年7月",
    intro: "本利用規約は、Wuloong Studio TOKYO（運営：GOODSEEDS、所在地：東京都世田谷区上馬）が提供するスタジオサービスの利用条件を定めるものです。詳細住所は、ご予約確定後にご案内いたします。ご予約・ご利用いただいた時点で、本規約に同意いただいたものとします。",
    sections: [
      {
        num: "1",
        title: "対象サービス",
        body: "当スタジオでは、以下のサービスを提供します。",
        bullets: [
          "レコーディング",
          "MIX / MASTER",
          "空間貸し",
          "動画撮影",
          "その他、当スタジオが提供する関連サービス",
        ],
      },
      {
        num: "2",
        title: "お支払いについて",
        body: "料金は、当日現金、各種カード決済、または事前決済にてお支払いいただきます。\n支払い方法は、ご予約内容や予約経路により異なる場合があります。",
      },
      {
        num: "3",
        title: "キャンセルについて",
        body: "キャンセル料は以下の通りです。",
        bullets: [
          "前日18時まで：無料",
          "前日18時以降 / 当日キャンセル：ご予約料金の50%",
          "無断キャンセル：ご予約料金の100%",
        ],
        note: "キャンセル料が発生した場合、当スタジオ指定の方法にてお支払いいただきます。",
      },
      {
        num: "4",
        title: "遅刻について",
        body: "ご予約時間に遅れた場合でも、終了時間の延長は原則として行いません。\n予約開始時間から30分以上遅れた場合は、当日キャンセル扱いとさせていただく場合があります。",
      },
      {
        num: "5",
        title: "利用人数について",
        body: "スタジオの利用人数は、原則として最大5名までとします。\n事前の申告なく人数が増えた場合、ご利用をお断りする場合があります。",
      },
      {
        num: "6",
        title: "喫煙・飲食・飲酒について",
        body: "スタジオ内での喫煙および軽食は可能です。\nただし、機材・設備・室内環境に影響が出る行為、または他のお客様や近隣への迷惑となる行為は禁止します。\n\n泥酔状態で来店された場合、または安全な利用が難しいと当スタジオが判断した場合は、当日の利用をお断りする場合があります。\nその場合、キャンセル扱いとし、ご予約料金の50%を後日ご請求いたします。",
      },
      {
        num: "7",
        title: "機材・設備の破損について",
        body: "利用者または同伴者の故意・過失により、スタジオ内の機材、備品、設備、内装等を破損・汚損・紛失した場合、修理費・交換費・清掃費その他必要な費用の100%を利用者にご負担いただきます。",
      },
      {
        num: "8",
        title: "録音データの保存について",
        body: "録音データは、原則としてご利用日から30日間保存します。\n保存期間を過ぎたデータについては、削除される場合があります。\n\nデータの管理には十分注意しますが、利用者ご自身でも必ずバックアップをお願いいたします。\n万が一、当スタジオの過失によりデータ保存に不備が発生した場合、当スタジオの対応は、該当するスタジオ利用料の返還を上限とします。\nデータ消失等により生じた利益の損失、制作機会の損失、配信・納期遅延、その他間接的な損害については、法令により認められる範囲で責任を負いません。",
      },
      {
        num: "9",
        title: "権利について",
        body: "録音された音源、歌詞、楽曲、映像、その他制作物に関する権利は、原則として利用者または正当な権利者に帰属します。\n当スタジオが、利用者の許可なく音源・映像・写真等を公開、配信、販売、または第三者に提供することはありません。",
      },
      {
        num: "10",
        title: "実績掲載について",
        body: "Spotifyリンク、写真、動画、SNS投稿、制作実績等を当スタジオのWebサイトやSNSに掲載する場合は、事前に利用者本人の許可を得た場合のみ行います。",
      },
      {
        num: "11",
        title: "未成年の利用について",
        body: "未成年の方も通常通りご利用いただけます。\nただし、予約内容や利用状況により、保護者の同意を確認させていただく場合があります。",
      },
      {
        num: "12",
        title: "禁止事項",
        body: "以下の行為は禁止します。",
        bullets: [
          "違法行為、または公序良俗に反する行為",
          "近隣住民、他のお客様、スタッフへの迷惑行為",
          "危険物の持ち込み",
          "無断での設備・機材の移動、分解、設定変更",
          "スタジオの運営に支障をきたす行為",
          "その他、当スタジオが不適切と判断する行為",
        ],
        note: "禁止事項に該当すると判断した場合、利用を中止いただく場合があります。その際の返金はいたしかねます。",
      },
      {
        num: "13",
        title: "規約の変更について",
        body: "本規約は、必要に応じて内容を変更する場合があります。\n変更後の規約は、当スタジオのWebサイト、予約ページ、またはその他当スタジオが定める方法により告知します。",
      },
    ],
  },
  en: {
    eyebrow: "TERMS OF SERVICE",
    title: "Terms of Service",
    lastUpdated: "Last updated: July 2025",
    intro: "These Terms of Service govern the use of studio services provided by Wuloong Studio TOKYO (operated by GOODSEEDS, located in Kamiuma, Setagaya, Tokyo). The full address will be provided upon booking confirmation. By making a reservation or using our services, you agree to these Terms.",
    sections: [
      {
        num: "1",
        title: "Services Covered",
        body: "Wuloong Studio TOKYO provides the following services:",
        bullets: [
          "Recording",
          "Mixing / Mastering",
          "Studio rental",
          "Video production",
          "Other related services offered by the studio",
        ],
      },
      {
        num: "2",
        title: "Payment",
        body: "Payment is accepted on the day of your session in cash, by card, or via advance payment.\nPayment method may vary depending on your booking type or reservation channel.",
      },
      {
        num: "3",
        title: "Cancellations",
        body: "Cancellation fees are as follows:",
        bullets: [
          "Before 6:00 PM the day prior: Free",
          "After 6:00 PM the day prior / Same-day cancellation: 50% of the booking fee",
          "No-show: 100% of the booking fee",
        ],
        note: "Cancellation fees will be collected via a method designated by the studio.",
      },
      {
        num: "4",
        title: "Late Arrivals",
        body: "If you arrive late, the session end time will not be extended as a general rule.\nIf you are 30 minutes or more late from your scheduled start time, the session may be treated as a same-day cancellation.",
      },
      {
        num: "5",
        title: "Number of Guests",
        body: "The studio accommodates a maximum of 5 people per session as a general rule.\nIf the number of guests exceeds what was stated at the time of booking without prior notice, we may refuse entry.",
      },
      {
        num: "6",
        title: "Smoking, Food & Alcohol",
        body: "Smoking and light snacks are permitted inside the studio.\nHowever, any behavior that could damage equipment, affect the studio environment, or cause a nuisance to neighbors is prohibited.\n\nIf a guest arrives in an intoxicated state, or if the studio determines that safe use is not possible, the session may be cancelled on the day.\nIn such cases, 50% of the booking fee will be charged after the fact.",
      },
      {
        num: "7",
        title: "Damage to Equipment & Facilities",
        body: "If equipment, fixtures, facilities, or interior elements are damaged, soiled, or lost due to the intentional or negligent actions of the user or accompanying guests, 100% of the cost of repair, replacement, cleaning, or any other necessary expenses shall be borne by the user.",
      },
      {
        num: "8",
        title: "Storage of Recording Data",
        body: "Recording data will be retained for 30 days from the date of your session as a general rule.\nData may be deleted after the retention period has passed.\n\nWhile we take care in managing your data, we strongly encourage all users to keep their own backups.\nIn the unlikely event of a data loss caused by the studio's negligence, the studio's liability is limited to a refund of the applicable session fee.\nThe studio is not liable, to the extent permitted by law, for lost profits, lost production opportunities, distribution or delivery delays, or any other indirect damages arising from data loss.",
      },
      {
        num: "9",
        title: "Intellectual Property Rights",
        body: "All rights to recorded audio, lyrics, music, video, and other creative works belong to the user or the rightful rights holder.\nThe studio will not publish, distribute, sell, or provide audio, video, or photographs to third parties without the user's explicit permission.",
      },
      {
        num: "10",
        title: "Portfolio & Credits",
        body: "Spotify links, photos, videos, social media posts, and other production credits will only be featured on the studio's website or social media with prior permission from the user.",
      },
      {
        num: "11",
        title: "Minors",
        body: "Minors are welcome to use the studio under the same conditions as adult users.\nHowever, depending on the nature of the booking or session, we may request parental or guardian consent.",
      },
      {
        num: "12",
        title: "Prohibited Conduct",
        body: "The following actions are prohibited:",
        bullets: [
          "Illegal activities or conduct contrary to public order and morals",
          "Harassment of neighbors, other guests, or staff",
          "Bringing in dangerous items",
          "Unauthorized relocation, disassembly, or reconfiguration of equipment",
          "Any action that disrupts studio operations",
          "Any other conduct deemed inappropriate by the studio",
        ],
        note: "If prohibited conduct is identified, the session may be terminated without refund.",
      },
      {
        num: "13",
        title: "Changes to These Terms",
        body: "These Terms may be updated as needed.\nChanges will be communicated via the studio's website, booking page, or other channels designated by the studio.",
      },
    ],
  },
}

export default function TermsPageContent() {
  const { lang } = useLang()
  const T = content[lang]

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 mt-[60px] lg:mt-[80px]">

        {/* Header */}
        <div className="mb-14">
          <p
            className="text-[#6b9fd4]"
            style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.2rem" }}
          >
            {T.eyebrow}
          </p>
          <h1
            className="text-[#1a2340] font-black"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "0.75rem" }}
          >
            {T.title}
          </h1>
          <p className="text-[#94a3b8] text-xs">{T.lastUpdated}</p>
        </div>

        {/* Intro */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-12"
          style={{ background: "linear-gradient(155deg, #f0f5ff 0%, #f8f0ff 100%)", border: "1px solid rgba(107,159,212,0.15)" }}
        >
          <p className="text-sm text-[#4a5568] leading-[1.95]">{T.intro}</p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {T.sections.map((section) => (
            <div key={section.num} className="border-b border-[#f0f4f8] pb-10 last:border-0">
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="text-[#6b9fd4] font-bold"
                  style={{ fontSize: "10px", letterSpacing: "0.2em" }}
                >
                  {section.num.padStart(2, "0")}
                </span>
                <h2
                  className="font-bold text-[#1a2340]"
                  style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
                >
                  {section.title}
                </h2>
              </div>

              {section.body && (
                <p
                  className="text-sm text-[#4a5568] leading-[1.95] mb-4"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {section.body}
                </p>
              )}

              {"bullets" in section && section.bullets && (
                <ul className="space-y-2 mb-4 pl-1">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#4a5568]">
                      <span className="text-[#6b9fd4] mt-0.5 flex-shrink-0">·</span>
                      <span className="leading-[1.8]">{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {"note" in section && section.note && (
                <p className="text-sm text-[#64748b] leading-[1.85] mt-3 pl-4 border-l-2 border-[#e2e8f0]">
                  {section.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-[#94a3b8] text-right mt-10">以上 / End of Terms</p>
      </div>
    </div>
  )
}
