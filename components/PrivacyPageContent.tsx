"use client"

import { useLang } from "@/contexts/LanguageContext"

const content = {
  ja: {
    eyebrow: "PRIVACY POLICY",
    title: "プライバシーポリシー",
    lastUpdated: "最終更新日：2026年11月9日",
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
        title: "Cookie・アクセス解析・広告の効果測定について",
        body: "本サイトでは、サイトの利用状況を把握して改善に役立てるため、Google LLCが提供するアクセス解析ツール「Google アナリティクス（GA4）」を利用しています。また、Google 広告を利用する際は、広告の効果を測定するため、Google アナリティクスとGoogle 広告を連携します。これらの計測ではCookieや、広告をクリックしたときにURLへ付与される識別子（gclidなど）を利用し、次のような情報を収集します。",
        bullets: [
          "閲覧したページ、閲覧日時、参照元（どのページやサイトから来たか）",
          "ご利用の端末・ブラウザの種類、おおよその地域などの情報",
          "広告をクリックして訪問した場合の、広告クリックに関する情報",
          "ページのスクロールや外部リンクのクリック、プランの選択、相談リンクのクリックなど、サイト内での操作",
          "予約フォームへの入力を始めたこと、予約のお申し込みを受け付けたこと",
        ],
        note: "予約フォームへの入力開始と予約申込の受付を示すイベントに独自に付与する項目は、選択したプラン（plan_id）と表示言語（lang）のみです。予約・お問い合わせフォームに入力された氏名、メールアドレス、電話番号、Instagram ID、ご相談内容、受付番号は、Google アナリティクスやGoogle 広告へ送信する計測情報には含めません。Cookieや広告クリック識別子を用いた計測情報は、完全に匿名であるとは限りません。また、表示言語（日本語／English）の選択は、再訪問時に同じ言語で表示するため、お使いのブラウザのlocalStorageに保存します。",
      },
      {
        title: "Google によるデータの利用と収集の制限について",
        body: "Google によるデータの利用については、Google の案内（https://policies.google.com/technologies/partner-sites）をご確認ください。これらの計測による情報の収集は、次の方法で制限できます。",
        bullets: [
          "ブラウザの設定でCookieを無効にする、または削除する",
          "Google アナリティクス オプトアウト アドオン（https://tools.google.com/dlpage/gaoptout）を利用する",
        ],
        note: "Google が表示する広告に関する設定は、Google の広告設定（https://adssettings.google.com/）で確認・変更できます。",
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
    lastUpdated: "Last updated: November 9, 2026",
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
        title: "Cookies, Analytics & Ad Measurement",
        body: "To understand how this site is used and improve it, we use Google Analytics (GA4), an analytics service provided by Google LLC. When we use Google Ads, we also link Google Analytics with Google Ads to measure how well our ads perform. This measurement uses cookies and identifiers added to the URL when an ad is clicked (such as gclid), and collects information such as the following:",
        bullets: [
          "Pages viewed, time of visit, and referrer (which page or site you came from)",
          "Device and browser type, approximate region, and similar technical information",
          "If you arrive by clicking an ad, information about that ad click",
          "On-site actions such as scrolling, clicking external links, selecting a plan, and clicking consultation links",
          "That you started filling in the booking form, and that your booking request was received",
        ],
        note: "The only custom parameters attached to the events for starting the booking form and for a received booking request are the selected plan (plan_id) and display language (lang). Your name, email address, phone number, Instagram ID, message, and receipt number from the booking or inquiry forms are not included in the measurement data sent to Google Analytics or Google Ads. Measurement data that uses cookies or ad click identifiers may not be completely anonymous. Your selected display language (Japanese / English) is also saved in your browser's localStorage so the site can show the same language on return visits.",
      },
      {
        title: "How Google Uses Data and How to Limit Collection",
        body: "For information on how Google uses data, please see Google's guidance (https://policies.google.com/technologies/partner-sites). You can limit the collection of information through this measurement in the following ways.",
        bullets: [
          "Disable or delete cookies in your browser settings",
          "Use the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout)",
        ],
        note: "You can review and change settings for ads shown by Google in Google's Ad Settings (https://adssettings.google.com/).",
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
