"use client"

import { useLang } from "@/contexts/LanguageContext"

const content = {
  ja: {
    eyebrow: "PRIVACY POLICY",
    title: "プライバシーポリシー",
    lastUpdated: "最終更新日：2026年10月4日",
    draftNotice:
      "このページは、現在のサイトの実装内容（予約フォーム・お問い合わせフォーム・使用している外部サービス）に基づいて作成した下書きです。保存期間や契約条件など、運営者による最終確認が済んでいない項目を含みます。正式な内容が確定するまでの参考情報としてご利用ください。",
    sections: [
      {
        title: "取得する情報",
        body: "予約フォームまたはお問い合わせフォームをご利用いただく際、以下の情報をご入力いただきます。",
        bullets: [
          "お名前",
          "メールアドレス",
          "電話番号（予約フォームのみ）",
          "Instagram ID（任意）",
          "ご相談内容・メッセージ本文",
        ],
      },
      {
        title: "利用目的",
        body: "ご入力いただいた情報は、以下の目的にのみ利用します。",
        bullets: [
          "予約内容の確認・管理",
          "お問い合わせへの回答",
          "スタジオ利用に関する必要なご連絡",
        ],
      },
      {
        title: "外部サービスの利用について",
        body: "予約・お問い合わせの処理にあたり、以下の外部サービスを利用しています。入力いただいた情報は、各サービスの提供事業者（Google LLC）のサーバーを経由して処理されます。",
        bullets: [
          "Google カレンダー（予約枠の管理）",
          "Gmail（確認メール・通知メールの送信）",
        ],
        note: "各サービスの取り扱いについては、Google社のプライバシーポリシーもご確認ください。",
      },
      {
        title: "Cookie・アクセス解析について",
        body: "本サイトでは、現時点でアクセス解析ツールや広告トラッキングは導入していません。表示言語（日本語／English）の選択のみ、お使いのブラウザのlocalStorageに保存します。これは解析目的ではなく、再訪問時に選択済みの言語を表示するためのものです。今後アクセス解析などを導入する場合は、本ページを更新してお知らせします。",
      },
      {
        title: "保存期間について",
        body: "予約・お問い合わせの情報について、現時点で定めた保存期間はありません。確認が取れた時点で、この項目を更新します。",
      },
      {
        title: "第三者への提供について",
        body: "法令に基づく場合を除き、ご入力いただいた情報を上記以外の第三者へ提供することはありません。",
      },
      {
        title: "開示・削除等のご連絡先",
        body: "ご自身の情報の確認・削除をご希望の場合は、Instagramまたはお問い合わせフォームよりご連絡ください。",
      },
      {
        title: "本ポリシーの変更について",
        body: "本ポリシーは、サービス内容の変更等に応じて更新する場合があります。変更後の内容は本ページにて公開します。",
      },
    ],
  },
  en: {
    eyebrow: "PRIVACY POLICY",
    title: "Privacy Policy",
    lastUpdated: "Last updated: October 4, 2026",
    draftNotice:
      "This page is a draft based on the site's current implementation (the booking form, contact form, and the external services in use). Some items, such as data retention periods and contractual terms, have not yet been finalized by the studio operator. Please treat this as reference information until a final version is confirmed.",
    sections: [
      {
        title: "Information We Collect",
        body: "When you use the booking form or contact form, you provide the following information.",
        bullets: [
          "Name",
          "Email address",
          "Phone number (booking form only)",
          "Instagram handle (optional)",
          "Your message / inquiry details",
        ],
      },
      {
        title: "Purpose of Use",
        body: "The information you provide is used only for the following purposes.",
        bullets: [
          "Confirming and managing your booking",
          "Responding to your inquiry",
          "Necessary communication related to studio use",
        ],
      },
      {
        title: "Third-Party Services",
        body: "We use the following external services to process bookings and inquiries. Information you submit passes through servers operated by their provider (Google LLC).",
        bullets: [
          "Google Calendar (booking/availability management)",
          "Gmail (sending confirmation and notification emails)",
        ],
        note: "Please also refer to Google's own privacy policy regarding how these services handle data.",
      },
      {
        title: "Cookies & Analytics",
        body: "This site does not currently use any analytics or advertising tracking tools. The only thing saved in your browser's localStorage is your selected display language (Japanese / English), which is used only to remember your preference on return visits, not for analytics. If analytics tools are introduced in the future, this page will be updated.",
      },
      {
        title: "Data Retention",
        body: "We have not yet defined a fixed retention period for booking or inquiry information. This section will be updated once that has been confirmed.",
      },
      {
        title: "Disclosure to Third Parties",
        body: "We do not share the information you provide with any third party other than those listed above, except where required by law.",
      },
      {
        title: "Requests to Access or Delete Your Information",
        body: "If you would like to review or delete your information, please contact us via Instagram or the contact form.",
      },
      {
        title: "Changes to This Policy",
        body: "This policy may be updated as our services change. Any updates will be published on this page.",
      },
    ],
  },
}

export default function PrivacyPageContent() {
  const { lang } = useLang()
  const T = content[lang]

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-24 mt-[60px] lg:mt-[80px]">
        <div className="mb-10">
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

        <div
          className="rounded-2xl p-6 sm:p-8 mb-12"
          style={{ background: "linear-gradient(155deg, #fff8ec 0%, #fff0f0 100%)", border: "1px solid rgba(230,160,100,0.2)" }}
        >
          <p className="text-sm text-[#4a5568] leading-[1.95]">{T.draftNotice}</p>
        </div>

        <div className="space-y-10">
          {T.sections.map((section) => (
            <div key={section.title} className="border-b border-[#f0f4f8] pb-10 last:border-0">
              <h2
                className="font-bold text-[#1a2340] mb-4"
                style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
              >
                {section.title}
              </h2>
              {section.body && (
                <p className="text-sm text-[#4a5568] leading-[1.95] mb-4" style={{ whiteSpace: "pre-line" }}>
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
      </div>
    </div>
  )
}
