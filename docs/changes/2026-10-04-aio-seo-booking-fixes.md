# 予約回復・SEO/AIO改善 変更記録（2026-10-04）

AIO/Google Search Console比較用の記録。公開前後の差分を追跡するために保存する。
このファイルはコードではなく記録用ドキュメント。内容は実装時点の事実であり、将来のコード変更で古くなる可能性がある。

## 0. 変更前のベースライン（公開調査時点・2026-10-04時点の指摘事項）

- LocalBusinessのJSON-LD `url`/`image` が `wuloong.studio` を参照（公開URLは `wuloong.jp`）
- JSON-LDの `sameAs` と画面上のInstagramリンクのハンドルが不一致
- トップ・FAQのFAQ回答がクリックするまでHTMLに存在しない
- `/api/availability` 失敗時に「空き枠がありません」と表示（通信エラーと満席を区別できない）
- `first-time-2h` プランのIDに "2h" を含むため、予約API側の文字列判定で**実際は2時間として登録される**バグ（3時間プランとして案内・表示されているにもかかわらず）
- トップページの初期HTMLに古い月（2026年7月）が固定表示される（ビルド時点の日付が焼き込まれる）
- `/pricing`・`/terms`・FAQ・トップのFAQでキャンセル条件の文言が3パターンに分かれていた
- フッターの「プライバシーポリシー」が `/contact` にリンクしていた（ポリシー本文は存在しない）
- `canonical`・`robots.txt`・`sitemap.xml` が存在しない（`/booking`・`/contact` はページ全体がClient Componentのためmetadataを持てない構造だった）
- 計測（GA4等）は未導入
- `.env.local` の `NEXT_PUBLIC_SITE_URL` が本番ドメインではなくVercelデフォルトURLを指していた（未使用）

## 1. 1回目の実装（本ドキュメント作成前のラウンド）で対応済み

- 予約API: サーバー側でプランを検証し、`durationHours` を明示的な値に変更（2h/3h誤判定を修正）
- `/api/availability` のエラー表示を分離、再試行ボタン追加、日付切替時の競合レスポンス対策
- プラン変更時の日時選択リセット、二重送信防止（クライアント側refガード）
- `/`・`/booking` を `force-dynamic` 化（初期HTMLの日付固定を解消）
- FAQコンポーネントを `<details><summary>` 化（回答がJS無しでも読める）
- キャンセル条件を `/terms` の内容に統一（前日18時まで無料・以降50%・無断100%）
- JSON-LDの `url`/`image`/`sameAs` を実際の本番URL・Instagramに修正
- 全主要ページに `canonical` を設定（`/booking`・`/contact` をサーバーコンポーネント化して分離）
- `robots.ts`・`sitemap.ts` を追加
- `/privacy` ページを新規作成（下書き。保存期間等は未確定と明記）、フッターのリンク先を修正
- `/first-time` に「予約前のプラン案内」試作（PlanGuide、ルールベース・AI不使用）を追加

## 2. 2回目の実装（本ラウンド）で対応した内容

### 2-1. テストが本番へ届かない仕組み
- `lib/env.ts`: `VERCEL_ENV`（Vercelが自動付与）に基づき `production`/`preview`/`development` を判定。認証情報の有無に依存しない。
- `lib/google-calendar.ts` / `lib/email.ts`: 実行対象を `mock`/`test`/`live` の3モードに分離。
  - production以外は原則 `mock`。
  - `ALLOW_TEST_INTEGRATION=true` と、テスト専用の宛先（`GOOGLE_TEST_CALENDAR_ID` / `TEST_ADMIN_EMAIL`）が設定されている場合のみ `test` モードで実連携を試せる。
  - `live`/`test` で必要な設定が不足している場合は `assertCalendarConfigured`/`assertEmailConfigured` が例外を投げ、予約APIは500を返す（モックの成功を返さない）。
- 検証: production相当・認証情報なしで明示的に500になること、preview相当・本番らしき認証情報があってもALLOW_TEST_INTEGRATION未設定なら必ずmockになることを確認済み。

### 2-2. 3時間予約の整合性
- `/api/availability` が `planId` を受け取り、`lib/pricing.ts` の `durationHours` を予約APIと共通で参照するよう統一。
- `computeAvailableSlots` のオーバーラップ判定を直接検証：「最初の2時間は空いているが3時間目に予定がある」ケースで正しく空きなしと判定されることを確認。
- `/api/bookings` に送信直前の空き再確認を追加し、`lib/slot-lock.ts` で同一スロットへの処理を直列化。ほぼ同時の2リクエスト・同一内容の再送のどちらでも、片方のみ成功し他方は409になることをローカルで確認。

### 2-3. 既存予約への影響調査
- `scripts/audit-booking-durations.mjs`（読み取り専用。書き込み・削除は一切行わない）で、本番カレンダーの今日から180日先までを点検。
- 結果: この予約システムが作成した `[予約]` 形式のイベントは **0件**（カレンダー上の既存23件はすべて本システム外のイベントで対象外）。所要時間の不整合は見つからなかった。

### 2-4. 日付修正の追加検証
- `lib/datetime.ts` でJSTの壁時計時刻への変換を明示化。サーバーがUTC（Vercel既定）・閲覧端末が別タイムゾーンの場合でも、JST深夜0時の境界で日付がずれないことを確認（`TZ=UTC`・`TZ=America/Los_Angeles`・`TZ=Asia/Tokyo` で同一の正しいJST日付になることを検証）。
- `force-dynamic` のため再ビルド不要で常に最新日付になることは既に確認済み。

### 2-5. 初心者ページの事実情報整理
- `/first-time` に `FirstTimeKeyFacts` を追加。価格・含まれる内容・準備物・データ受け取り方法・支払い・キャンセル等を、既存の確定済みテキスト（`lib/pricing.ts`・`lib/i18n.ts`）のみから一次情報として平文で掲載。
- 担当者紹介・テキストでの実績紹介は、ユーザー確認の結果「今回は見送り」のため追加していない（Spotify埋め込みは維持）。

### 2-6. 計測（analytics）
- `lib/analytics.ts`: `NEXT_PUBLIC_GA_MEASUREMENT_ID` 未設定時はgtag.js自体を読み込まず、`track()`も何もしない。
- `plan_select` / `booking_start` / `availability_error` / `booking_submit_success` / `booking_submit_error` / `consult_click` / `plan_guide_complete` を実装。氏名・メール・電話・Instagram・相談内容は送信しない。
- `booking_submit_success` は「APIが予約リクエストを受理した」ことのみを示し、スタジオによる予約確定とは区別。
- 測定ID設定時のみgtagスクリプトが出力されることをビルド比較で確認。

### 2-7. 公開前の内容整理
- `.env.local` の `NEXT_PUBLIC_SITE_URL` を実際の本番ドメイン `https://wuloong.jp` に修正。テスト連携用・計測用の環境変数をコメントで追記。
- `lib/i18n.ts` 内の未使用（dead code）だった `pricingPage.notes` の古いキャンセル文言も、現行の条件に揃えて修正。

## 3. 変更ファイル一覧（本ラウンド）

新規:
- `lib/env.ts` / `lib/datetime.ts` / `lib/slot-lock.ts` / `lib/analytics.ts`
- `components/FirstTimeKeyFacts.tsx`
- `scripts/audit-booking-durations.mjs`
- `docs/changes/2026-10-04-aio-seo-booking-fixes.md`（本ファイル）

変更:
- `lib/google-calendar.ts`（mock/test/live分離、durationHours引数化、JST整理）
- `lib/email.ts`（mock/test/live分離、test宛先への強制リダイレクト）
- `app/api/availability/route.ts`（planId対応）
- `app/api/bookings/route.ts`（preflight検証、直前の空き再確認、スロットロック）
- `components/BookingCalendar.tsx`（JST壁時計時刻、planId対応、所要時間表示）
- `components/BookingForm.tsx`（409時の表示、analytics計測）
- `components/HomePageContent.tsx`（カレンダーへのplanId指定、analytics計測）
- `components/PlanGuide.tsx`（analytics計測）
- `components/FirstTimePageContent.tsx`（FirstTimeKeyFacts追加）
- `app/layout.tsx`（gtag.js条件付き読み込み）
- `lib/i18n.ts`（`firstTimeFacts`・`conflictMsg`追加、dead code修正）
- `.env.local`（`NEXT_PUBLIC_SITE_URL`修正、テスト/計測用変数の追記）

## 4. 公開（デプロイ）予定の変更一覧

Vercelへデプロイした場合に有効になる変更：

1. 予約APIの2h/3hバグ修正・サーバー側プラン検証
2. 空き状況取得のエラー表示分離・再試行・JST表記
3. トップ/予約ページの日付固定バグ修正（force-dynamic）
4. FAQの検索エンジン向けSSR化
5. キャンセル条件の表記統一
6. JSON-LD・canonical・robots.txt・sitemap.xmlの追加/修正
7. `/privacy` ページ新規公開、フッターリンク修正
8. `/first-time` のプラン案内試作・一次情報セクション追加
9. 環境別（mock/test/live）の予約連携ガード — **本番運用に影響する変更ではないが、Preview環境の挙動が変わる**（Previewは常にmockになる。従来「本番の認証情報が設定されていればPreviewでも実際にカレンダーに書き込まれていた」状態から変わる）
10. 予約APIの直前空き再確認・二重予約防止ロック
11. GA4計測コード（測定ID未設定のため現時点では非アクティブ）

## 5. 残っている確認事項

### 5-1. 2026-10-04 ユーザー確認により解消した項目
- **Instagram**: `@wuloongstudio`（`https://www.instagram.com/wuloongstudio/`）で確定。コード側の設定（`INSTAGRAM_URL`）は変更不要であることを確認済み。
- **キャンセル条件（文言）**: 以下の文言に統一し、`/faq`・トップのFAQ・`/first-time`の一次情報Q&Aに反映済み。
  > 大変申し訳ないのですが、エンジニアのスケジュール対応の都合上、キャンセルは前日の18時までとさせていただいております。当日のキャンセルにつきましては、キャンセル料50%をお願いしております。心苦しいのですが、ご理解のほどよろしくお願いいたします。クレジットカードで前払いの場合は50%を差し引いてからお振込対応いたしますのでよろしくお願いいたします。
  - `/pricing`の注記・`/terms`の規約本文（前日18時まで無料／当日50%）も同じ内容で一致していることを確認済み。
  - `/terms`にのみ存在する「無断キャンセル：ご予約料金の100%」の項は、今回のユーザー確認では言及されなかったため変更していない（当日キャンセルとは別の無断キャンセル時のみの規定として維持）。

### 5-2. まだ残っている確認事項
- プライバシーポリシー（`/privacy`）の内容は、実際の運用ルールとの最終確認が未了（下書き段階）。
- GA4の測定IDは未設定。設定後はGA4のDebugViewまたはブラウザのネットワークタブで `gtag/js` の読み込みとイベント送信を確認すること。
- テスト連携（`ALLOW_TEST_INTEGRATION`）を使う場合は、本番とは別のGoogleカレンダー（`GOOGLE_TEST_CALENDAR_ID`）と検証用メールアドレス（`TEST_ADMIN_EMAIL`）を用意する必要がある（未作成）。

## 6. 予約ロック・再送処理の最終確認（追加ラウンド）

新機能追加や既検証項目のやり直しは行わず、以下3点のみを対象に実施。

### 6-1. lib/slot-lock.ts の保存先・キー・有効範囲
- 保存先はNode.jsプロセスのメモリ（モジュール内の`Map`）のみ。DB・外部サービスは不使用。
- キーを `${date}T${time}`（開始時刻単位）から `studio:${date}`（日付単位）に変更。
  - 従来のキーでは、開始時刻が異なるが時間帯が重なるリクエスト（13:00〜16:00 と 14:00〜17:00 等）が別々のキューに入り、直列化されていなかった（実機確認で再現、後述6-2で修正確認）。
- 有効範囲：**同一プロセス内でのみ直列化**。Vercel等で複数インスタンスが並行稼働する場合・コールドスタート後の新しいプロセスでは共有されない。コメントに明記済み。外部ロック（Redis/DB等）の新規契約は行っていない。

### 6-2. 重複する時間帯（13:00〜16:00 / 14:00〜17:00）の同時予約
- 修正前のキー（開始時刻単位）では、理論上この2つは別キューに分かれるため防げない設計だった。
- 日付単位キーへの変更後、mockモードで実機検証：同一日の13:00開始(3h)と14:00開始(3h)を同時送信し、**片方のみ成功・他方は409**になることを確認（ログ・レスポンス採取済み）。

### 6-3. 通信切断後の再送・別利用者との競合の区別
- `lib/idempotency-store.ts`（Node.jsプロセスメモリのみ、新規外部サービス不使用）を追加。クライアントが生成する`idempotencyKey`をキーに、成功結果（eventId）のみをキャッシュする。失敗・競合はキャッシュしない。
- `components/BookingForm.tsx`：選択中の日時が変わらない限り同じ`idempotencyKey`を使い続け、送信ボタン再送時も同じキーを送る実装に変更。
- 実機検証：
  - 同じ`idempotencyKey`で2回送信 → 2回目も**1回目と同一のeventId**を返し、新規登録は発生しない（「同じ予約操作の再送」として成立済みの結果を返却）。
  - 別の`idempotencyKey`・別利用者が同じ枠に送信 → 正しく409（「別利用者による競合」として新規の空き確認が実行される）。

### 6-4. 複数インスタンス（2プロセス）での確認
- mockモードのサーバーを別ポート（3100・3101）で2プロセス起動し、同一日時へ同時送信。
- 結果：**両方とも200で成功**（プロセスをまたいだ排他は機能しない）。これは6-1で明記した設計上の限界どおりであることを実証した。新しい外部ロックは追加していないため、本番で複数インスタンスが同時に同一スロットを処理した場合、この限界は残る（live/testモードでは登録直前に実際のGoogleカレンダーへ空き確認を行うため無防備ではないが、完全な排他ではない）。

### 6-5. 変更ファイル（本ラウンドのみ）
- `lib/slot-lock.ts`（保存先・キー・範囲のコメント明記、キーを日付単位に変更）
- `lib/idempotency-store.ts`（新規）
- `app/api/bookings/route.ts`（idempotencyKey対応、ロックキー変更）
- `components/BookingForm.tsx`（idempotencyKey生成・送信）

## 7. 予約フローを「スタッフ確認後に確定」方式へ変更

複数インスタンス間の排他が未解決でも、重複申込が自動で予約確定として扱われないようにするための暫定対応。
共有DB・Redis・新しい管理画面・確定APIは追加せず、既存のGoogleカレンダー・メールのみを使用。詳細な手順は
`docs/booking-confirmation-runbook.md` を参照。

- 予約は「申込受付」として扱い、確定はスタッフが手動でカレンダーを編集し、手動でメール/DMを送って行う。
- `lib/receipt.ts`（新規）：idempotencyKey＋申込内容から受付番号を決定論的に計算する純粋関数。メモリに依存しないため、別プロセス・再起動後でも同じ入力なら同じ受付番号になる。内容が変われば別の受付番号になり、古い申込と混同しない。
- `lib/google-calendar.ts`：登録するイベントのタイトルを`[予約申込・未確定]`に変更し、attendees・自動招待（sendUpdates）を廃止。受付番号で既存イベントを検索する`findBookingByReceipt`、通知失敗をカレンダー説明欄に記録する`markNotificationFailed`を追加。
- `lib/email.ts`：顧客向け・管理者向けメールの件名・本文を「申込受付」「要確認：予約申込」に変更し、住所等の確定後情報は記載しない。
- `app/api/bookings/route.ts`：カレンダー保存の成功/失敗と、メール送信の成功/失敗を明確に分離（カレンダー保存失敗時のみ申込失敗として扱う）。レスポンスに`status: "pending_confirmation"`・`receiptNumber`を追加。
- `components/BookingForm.tsx` / `lib/i18n.ts`：送信前の注意文、受付完了画面（受付番号・プラン・希望日時を表示）、関連FAQ等の文言を「即時確定」を示さない表現に統一。
- 検証（すべてmockモード。本番カレンダー・メール・デプロイは行っていない）：
  - 正常申込でreceiptNumber・`status:"pending_confirmation"`が返ることを確認。
  - 同一idempotencyKey＋同一内容の再送で同じ受付番号・同じeventIdが返ることを確認。
  - 同一idempotencyKeyで内容（電話番号）を変えた場合、別の受付番号として扱われ、古い成功結果を返さないことを確認（空いている別時間では新規に成立、同じ時間帯では409になることを確認）。
  - 2つの独立プロセス（別ポート）に同一idempotencyKey＋同一内容を送信し、受付番号自体は完全に一致する（決定論的）が、mockモードでは各プロセスが独立した仮カレンダーを持つため重複イベントが作られることを確認（live/testモードでは実際の共有カレンダーを検索するため挙動が異なる。詳細はrunbook参照）。
  - カレンダー保存失敗時に成功を返さない構造、メール送信失敗時に成功は返すが通知失敗を記録する構造は、コードレビューで確認（mockのメール送信は常に成功するため、実際にメール送信だけを失敗させる runtime テストは、外部サービスへの実アクセスを避けるため今回は実施していない）。
- 残る制約：複数インスタンス間の完全な排他は今回も実現していない。解決したのは「重複が自動で確定予約にならないこと」であり、重複した未確定申込自体の発生可能性は残る（runbookの手順で人が吸収する設計）。

## 8. メール送信失敗の動作確認（追加ラウンド・mockのみ）

前回「mockのメール送信は常に成功するため実施していない」としていた項目を、外部通信なしのテスト専用フックで追加検証した。

- `lib/email.ts`：`BOOKING_TEST_FORCE_EMAIL_FAILURE=true`（mockモード時のみ有効）で、`sendCustomerConfirmation`/`sendAdminNotification`を意図的に例外で失敗させるテスト専用フックを追加。liveモードでは無視される。
- `lib/google-calendar.ts`：`markNotificationFailed`を常にtry/catchで囲み、どのモードでも外部へ例外を投げない設計に変更。さらに`BOOKING_TEST_FORCE_CALENDAR_PATCH_FAILURE=true`（mockモード時のみ）で「通知失敗の記録（カレンダーへの追記）自体も失敗する」状況を再現できるようにした。
- `app/api/bookings/route.ts`：`markNotificationFailed`の呼び出しを明示的にtry/catchで囲み、万一の想定外の例外でも受付済みの申込を失敗扱いにしない／ログに残すことを呼び出し側でも保証。
- 検証結果（すべてmock、外部通信なし）：
  - カレンダー保存成功・メール送信失敗 → APIは`success:true, status:"pending_confirmation", receiptNumber`を返し、申込成功を維持することを確認。
  - サーバーログに`[mock] notification failed for receipt ...`が記録され、通知失敗がカレンダー側相当のストアに記録されたことを確認。
  - 同一idempotencyKey・同一内容で再送し、同じreceiptNumber・同じeventIdが返ることを確認（＝申込がカレンダー上に残っている）。
  - メール送信失敗 ＋ カレンダーへの追記失敗を同時に発生させても、APIは引き続き申込成功（`pending_confirmation`）を返し、サーバーログに`[bookings] Failed to mark notification failure on calendar event: ...`として追記失敗の事実が記録されることを確認。受付済みの申込が失敗扱いになることはなかった。
  - 画面側（`components/BookingForm.tsx`）はメール送信の成否を一切参照しないことをコードレビューで確認。APIレスポンスの形は正常時と同一のため、メール失敗時も常に「申込受付」の成功表示になり、再送を促す表示は出ない。
  - テストフラグ未設定時の通常動作（APIレスポンス・全ページ表示）に影響がないことを再確認。
- 見つかった問題：なし（既存の設計が想定通り動作することを確認。修正は防御強化のみ）。
- Vercel Production環境変数の確認（値は非表示、名前のみ）：`GOOGLE_CLIENT_ID`・`GOOGLE_CLIENT_SECRET`・`GOOGLE_REFRESH_TOKEN`・`GOOGLE_CALENDAR_ID`・`GMAIL_USER`・`GMAIL_APP_PASSWORD`・`ADMIN_EMAIL`・`NEXT_PUBLIC_SITE_URL`が設定済み。live運用に必要な既存変数の不足なし。テスト専用フラグ（`ALLOW_TEST_INTEGRATION`等）はProductionに設定されておらず、これは正しい状態。

## 9. 本番公開（2026-10-04）

**公開日時（JST）**：2026-10-04 15:50:23（Vercel production deployment created time）
**対象コミット**：`040e07a316a427a672ebbd07edceeea9ec649d79`（"Add booking-duration audit script and operational docs"。このコミットまでの4コミット一式を公開）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-iit2h8b8r-neighxs-projects.vercel.app` / id `dpl_81uvuVBSF9KGEzJ2ubQidT35aRJN`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-5ed5h9xf9-neighxs-projects.vercel.app`（id `dpl_CwXyhrSrfd9P9C2t9PqHRGbuJHCA`、commit `595a2b1508425b3e5e21fe1c67b13936ae7d9a40`、2026-07-04 10:42:02 JST作成）。切り戻しが必要な場合は `vercel rollback https://wuloong-studio-tokyo-5ed5h9xf9-neighxs-projects.vercel.app` を使う。

**デプロイ手順**：既存のGitHub連携（`git push origin main`）によるVercelの通常の自動ビルド・デプロイ。新しいデプロイ用スクリプト等は追加していない。

**公開後の確認結果（すべて読み取り操作。本番へのテスト予約・テスト登録・実メール送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| トップ・予約ページの初期HTMLの月表示 | JST基準で「2026年10月」（確認時点のJSTの月）と一致 |
| 予約フォームの「スタッフ確認後に確定」表示 | 「送信後、内容と空き状況をスタジオが確認し、確定のご連絡をいたします。この時点では予約は確定しておりません。」を確認 |
| 初心者ページ・FAQページの表示 | 両方200。FAQ回答本文が初期HTML（クリック前）に存在することを確認 |
| canonical / JSON-LD / robots.txt / sitemap.xml | いずれも`https://wuloong.jp`に統一されていることを確認（JSON-LDのurl/sameAsも含む） |
| 空き状況API（正しいplanId） | `durationHours:3`で正常応答。不正な入力は「空きなし」ではなく明示的な400エラーを返す |
| 本番の外部連携モード | **live**で動作していることを確認。読み取り専用で実カレンダーの既存予定（他システム作成、個人情報は取得・記録していない）の時間帯のみを取得し、同じ日時を公開APIに問い合わせたところ、その時間帯だけが正しくBUSYとして返ることを確認（mockであれば起こり得ない結果）。秘密値は一切出力していない |

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**未確認事項（今回確認していないこと）**：
- 実際の予約フォーム送信（カレンダー登録・確認メール送信）は、本番では一度も行っていない。読み取り確認のみで、送信フローそのものの本番動作は未確認。
- GA4計測は測定ID未設定のため非アクティブ（想定通り）。
- プライバシーポリシー・キャンセル条件の最終的な運用確認は別途ユーザー側で完了済みの前提だが、本番ページの表示文言と運用の一致はこちらでは判断できない。
- モバイル実機・各ブラウザでの表示は未確認（レスポンス内容のみの確認）。

## 10. 本番公開（2026-10-04 23:33 JST）— 料金・歌詞案内・プライバシー表記の修正

**公開日時（JST）**：2026-10-04 23:33:48（Vercel production deployment created time）
**対象コミット**：`d5b52ed`（"Fix pricing, lyrics, and messaging inconsistencies on the public site"）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-ozbackqmp-neighxs-projects.vercel.app` / id `dpl_DNskfSn1PfwrHMrzS3pw8WVqa1di`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-k7dbl5t0h-neighxs-projects.vercel.app`（commit `ee17f24`）。`vercel rollback https://wuloong-studio-tokyo-k7dbl5t0h-neighxs-projects.vercel.app` で戻せる。

**デプロイ手順**：前回までと同じ、GitHub連携（`git push origin main`）によるVercelの通常の自動ビルド・デプロイ。

**内容**：初回料金「12,000円（税込・3時間）」への統一とMIX/マスター別料金の明示、歌詞任意の案内統一、トップのHero文言修正（誤解回避・導線追加）、キャンセル条件の無断キャンセル100%復元、LINE案内の削除、担当者（石川）の役割記載、プライバシーポリシーの「下書き」表記削除。詳細はコミットメッセージおよび本会話の直前のやり取りを参照。

**公開後の確認結果（すべて読み取り操作。本番へのテスト予約・登録・送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| トップHeroの価格・ジャンル・導線 | 「三軒茶屋のボーカルレコーディングスタジオ」「初回3時間12,000円（税込）」「初めての方へ」を確認 |
| 価格カードのMIX別料金表記 | 「3時間・MIX/マスタリングは別料金」を確認 |
| `/first-time` title | 「初めてのレコーディング｜三軒茶屋・3時間12,000円｜Wuloong Studio TOKYO」を確認 |
| `/first-time` 歌詞任意の注記 | 初期HTMLに3箇所（チェックリスト・Key Facts・安全ポイント）出力を確認 |
| `/pricing` に「必須」の表記が無いこと | 確認（該当なし） |
| `/privacy` に「下書き」の表記が無いこと | 確認（削除済み） |
| 主要ページ（/、/booking、/faq、/pricing、/terms、/privacy、/contact、/first-time） | すべて200 |

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**未確認事項**：
- 石川氏の役割表記・プライバシーポリシーの保存期間/契約条件は、運営者確認済み（2026-10-04のやり取りで確認済み）。
- モバイル実機でのスクリーンショット確認はローカル環境（ローカルにインストールしたPlaywright、mockモード）で実施済みだが、本番URLそのものでの実機確認は未実施。
- GA4計測は引き続き測定ID未設定のため非アクティブ。

## 11. 本番公開（2026-10-19 03:22 JST）— Web予約を30日先までに制限、予約カレンダーの英語化

**公開日時（JST）**：2026-10-19 03:22:08（Vercel production deployment created time）
**対象コミット**：`14bd236`（"Limit web booking to 30 days ahead; route longer-term requests to DM/email"）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-f3mpc8u2z-neighxs-projects.vercel.app` / id `dpl_H1yWxft7P8b1DnSyjBqA3ZJRXubN`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-ft7uiuoqy-neighxs-projects.vercel.app`（commit `37e848f`）。`vercel rollback https://wuloong-studio-tokyo-ft7uiuoqy-neighxs-projects.vercel.app` で戻せる。

**デプロイ手順**：前回までと同じ、GitHub連携（`git push origin main`）によるVercelの通常の自動ビルド・デプロイ。

**内容**：
- Web予約カレンダーで選択できる日付を「本日から30日先」までに制限（それ以降の日はグレーアウトし、「次の月へ」も進めない年月には進ませない）。カレンダー下に期限日・Instagram DM/メールへの案内を表示。
- `/api/bookings`にもサーバー側で同じ期間制限（と過去日付の拒否）を追加。
- `components/BookingCalendar.tsx`を全面的に多言語対応（これまで日本語固定だった曜日・読み込み中・エラー文・空き/予約済み表示・新しい期間案内文などをJA/EN両方に）。

**公開後の確認結果（すべて読み取り操作。本番へのテスト予約・カレンダー登録・実メール送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| 主要ページ（/、/booking、/first-time、/pricing、/faq、/terms、/privacy、/contact） | すべて200 |
| `/booking`の初期HTMLに期間案内文があるか | 「Web予約は本日から30日先」を確認 |
| 空き状況API | 正常応答（durationHours等含む） |
| 30日超の日付での予約申込 | `POST /api/bookings`が400で明示的に拒否（カレンダー・メール送信には到達しない設計のため安全に検証） |

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**追加確認**：本番配信のJSバンドル内に英語の期間案内文（"Online booking is open from today..."）が含まれていることを確認した（読み取りのみ）。

**未確認事項**：
- 英語版カレンダーUIの実際の見た目（レイアウト等）は、ローカル環境（mockモード・Playwright）でのみスクリーンショット確認済み。本番URLでの実機スクリーンショット確認は未実施（文言がバンドルに含まれていることのみ確認）。
- GA4計測は引き続き測定ID未設定のため非アクティブ。

## 12. 本番公開（2026-10-19 03:50 JST）— MIX・マスタリングの利用規約・注意事項を追加

**公開日時（JST）**：2026-10-19 03:50:48（Vercel production deployment created time）
**対象コミット**：`86218a1`（"Add MIX/mastering terms clause and notice section"）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-ia6j8qxs6-neighxs-projects.vercel.app` / id `dpl_3nGq5BLkDLMUxcFLm3YK43gV3Efs`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-6qi86cn0z-neighxs-projects.vercel.app`（commit `89c219c`）。`vercel rollback https://wuloong-studio-tokyo-6qi86cn0z-neighxs-projects.vercel.app` で戻せる。

**デプロイ手順**：前回までと同じ、GitHub連携（`git push origin main`）によるVercelの通常の自動ビルド・デプロイ。

**内容**：
- `/terms`（利用規約）に「MIX・マスタリングサービスについて」を新条項として追加（制作期間・修正対応・返金について・当スタジオの不備について、の4項目）。従来の最終条「規約の変更について」は番号を繰り下げて末尾を維持。
- `/song-package`に、同内容を平易な文章にした「NOTICE」ボックスを追加。
- 日英両方に反映。トップ・料金表・予約フォーム等、他ページは変更していない。

**公開後の確認結果（すべて読み取り操作。本番へのテスト予約・登録・送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| `/terms`の初期HTMLに新条項があるか | 「MIX・マスタリングサービスについて」「制作期間」を確認 |
| `/song-package`の初期HTMLに注意事項があるか | 「MIX・MASTERINGについて」「原則としてお受けいたしかねます」を確認 |
| 主要ページ（/、/booking、/first-time、/pricing、/faq、/terms、/privacy、/contact、/song-package、/access、/monthly-support） | すべて200 |
| `/pricing`の料金表示が変わっていないこと | ¥12,000・¥30,000〜とも変更なしを確認 |

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**未確認事項**：
- 英語版の新条項・注意事項は、配信バンドル内に英文が含まれていることのみ本番で確認（詳細な表示レイアウトはローカルでのみ確認済み）。
- 返金・修正対応等の運用上の実態（実際の初稿納期の目安等）は、今回いただいた文面をそのまま反映したもので、別途の事実確認は行っていない。

## 13. 本番公開（2026-10-19 04:32 JST）— MIX・MASTERINGの注意事項を開閉式に変更

**公開日時（JST）**：2026-10-19 04:32:59（Vercel production deployment created time）
**対象コミット**：`0beeb4e`（"Make the song-package MIX/mastering notice collapsible"）
**公開URL**：https://wuloong.jp/song-package （Vercel deployment: `https://wuloong-studio-tokyo-9q58on3jm-neighxs-projects.vercel.app` / id `dpl_746VHB7C1sDSmYKm7vP8F7n9L4pW`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-nms3gotbg-neighxs-projects.vercel.app`（commit `77a0262`）。`vercel rollback https://wuloong-studio-tokyo-nms3gotbg-neighxs-projects.vercel.app` で戻せる。

**内容**：`/song-package`の「MIX・MASTERINGについて」通知ボックスを、FAQコンポーネントと同じ`<details>/<summary>`方式の開閉式に変更。デフォルトは閉じた状態（タイトルのみ表示）で、クリックすると本文が展開される。本文はクリック前からSSR済みの初期HTMLに含まれる。他ページへの変更なし。

**公開後の確認結果（読み取り操作のみ）**：`<details>`要素と本文「原則としてお受けいたしかねます」が初期HTMLに含まれていることを確認。主要11ページすべて200。重大な不具合なし、切り戻しは行っていない。

## 14. 本番公開（2026-10-23 05:20 JST）— Web予約の受付期間を「翌月末日まで」の月末モデルに変更

**公開日時（JST）**：2026-10-23 05:20:06（Vercel production deployment created time）
**対象コミット**：`def2abe`（"Web予約の受付期間を「翌月末日まで」の月末モデルに変更"）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-ery18iq1i-neighxs-projects.vercel.app` / id `dpl_31stvSNuRZZHNEgpWv9sRKnPZQKT`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-hn7w2kzp4-neighxs-projects.vercel.app`。`vercel rollback https://wuloong-studio-tokyo-hn7w2kzp4-neighxs-projects.vercel.app` で戻せる。

**経緯**：前回（#12〜#13より前）導入した「本日からWEB_BOOKING_WINDOW_DAYS=30日先まで」の固定ローリング窓を、以下の新仕様に置き換えてほしいとの依頼。実装前に現行仕様との差分・論点を整理して提案し、ユーザーの承認（2点の確認事項：①スタッフ対応可能時間は既存の固定営業時間10:00-22:00＋カレンダー予定優先のロジックで十分、②表示文言の方向性）を得たうえで実装した。

**新仕様**：
- 予約受付は常に「翌月末日」まで（固定の日数ではなく、月の切れ目を基準にした可変長の窓）。
- 毎月1日0:00（JST）に翌月分が自動的に受付対象に加わる。
- 例：2026-10-23時点なら2026-11-30まで。2026-11-01になれば2026-12-31まで自動延長。
- Googleカレンダーの予定・スタッフの対応可能時間を優先し、空いている時間のみ表示（既存の`getAvailableSlots`のロジックをそのまま使用、変更なし）。
- 既存の予約データ・3時間枠・二重予約防止機能（`slot-lock.ts`/`receipt.ts`/未確定フロー）は無変更。
- タイムゾーンはAsia/Tokyo固定（従来から`lib/datetime.ts`で一貫）。
- 既存デザインは変更せず、受付期間の計算と表示文言のみ変更。

**実装方針（cronなし）**：境界値（＝翌月末日）はリクエストごとにJSTの「今日」からその場で計算する純粋関数`getEndOfNextMonth()`を新設し、固定日数を加算する従来方式から置き換えた。月初(1日0:00 JST)を跨ぐと計算結果が自動的に進むため、別途スケジュール実行（cron等）は不要。

**変更ファイル**：
- `lib/datetime.ts`：`getEndOfNextMonth(dateStr)`を追加（年またぎ・うるう年を含めてローカルで単体ケース検証済み：2026-10-23→2026-11-30、2026-11-01→2026-12-31、2026-12-15→2027-01-31、2028-01-01→2028-02-29 等）。
- `lib/constants.ts`：`WEB_BOOKING_WINDOW_DAYS`（固定30日の定数）を削除。
- `components/BookingCalendar.tsx`：`maxBookableDate`の算出を`addDaysToDateString(today, 30)`から`getEndOfNextMonth(today)`に置き換え（「次月へ」ナビゲーションの非活性判定・個別日の非活性判定は構造そのまま、比較対象の境界値のみ変更）。
- `app/api/bookings/route.ts`：サーバー側の受付期間バリデーションを同様に置き換え。エラーメッセージも実際の受付最終日（例：`2026-11-30まで`）を表示するよう変更。
- `lib/i18n.ts`：`bookingCalendar.windowNote`/`windowTooltip`の文言を「本日から{days}日先（{date}）まで」という表現から「{date}までご予約いただけます。毎月1日に翌月分を自動で受付開始」という表現に変更（日英両方）。

**公開後の確認結果（すべて読み取り操作、または副作用の前にサーバー側で短絡的に拒否されるバリデーション境界の確認のみ。本番への実際の予約送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| サイトが生きているか（`GET /`） | 200 |
| `/booking`の配信バンドルに新文言（JA「毎月1日」/EN「rolls forward」）が含まれるか | 含まれる（`17982_flw30_5.js`） |
| 旧文言（「日先」/「days ahead」）が配信バンドルから消えているか | 消えている（全チャンクでヒットなし） |
| `GET /api/availability?date=2026-11-10`（新しい窓の範囲内） | 200、3時間刻みの空き枠を通常通り返す |
| `POST /api/bookings`に過去日（2020-01-01）を送信 | 400「Requested date is in the past」（カレンダー・メール等の副作用より前に短絡的に拒否されることを確認） |
| `POST /api/bookings`に新しい窓の境界を超える日（2026-12-15、今日2026-10-23時点での翌月末2026-11-30より先） | 400「この日程はWeb予約の受付期間（2026-11-30まで）を超えています。〜」 |
| ローカル（mockモード）で窓内の日付（2026-11-25）を送信 | 200 成功（旧30日窓では対象外だったが、新仕様では範囲内であることを確認） |

事前にローカルで`tsc --noEmit`・`next build`が成功していることも確認済み。

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**未確認事項**：
- 実際に月をまたいだ瞬間（1日0:00 JST）の自動延長そのものは、計算が「その場で今日の日付から導出される」設計のため本番でのタイミング実地確認はしていない（ロジック上、cron等の時刻トリガーに依存しないため動作原理上の不確実性は小さいと判断）。
- ページを開いたまま日付が変わった場合（例：月末23:59 JSTにページを開いたまま日付をまたぐ）、ブラウザ側の「今日」の値はページ読み込み時点のまま保持される（リロードするまで窓は更新されない）。これは本変更前からの既存の挙動で、今回新たに導入した制約ではない。

## 15. 本番公開（2026-10-23 06:24 JST）— P0改善：キャンセルポリシー文言統一／MIX・MASTERING単体サービス追加

**公開日時（JST）**：2026-10-23 06:24:29（Vercel production deployment created time）
**対象コミット**：`bcb620f`（"P0: キャンセルポリシー文言統一とMIX/MASTERING単体サービス追加"）
**公開URL**：https://wuloong.jp （Vercel deployment: `https://wuloong-studio-tokyo-mjcwzfgq8-neighxs-projects.vercel.app` / id `dpl_GZYMaJaPVFirvTV2qxwi38iCP14g`）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-9qug0mtcs-neighxs-projects.vercel.app`。`vercel rollback https://wuloong-studio-tokyo-9qug0mtcs-neighxs-projects.vercel.app` で戻せる。

**経緯**：ユーザーからP0（最優先）改善として3項目の依頼。既存のデザイン・予約システム・Googleカレンダー連携・予約データを壊さないことを厳守した上で、以下を実装前に調査・検証した。

**P0-1（予約受付期間の確認）— 調査のみ、コード変更なし**：
前回（#14）で実装済みの「常に翌月末日まで、毎月1日0:00 JSTに自動延長」モデルが、依頼内容と完全に一致していることを確認。TOPページと予約ページは同一の`BookingCalendar`コンポーネントを使用しているため表示は構造的に一致。「30日先まで」等の旧文言は全文検索で0件（無関係な「30日サポート」プラン名・30日データ保存規定のみ残存、変更不要）。ユーザー指定の全例（2026-10-23→11-30、2026-11-01→12-31、2026-12-01→2027-01-31、大晦日→1-31、平年2月末、うるう年2月末）を`getEndOfNextMonth()`のローカル単体テストで再検証し、すべて一致。フロントエンドとAPIは同一関数を参照しておりロジックの二重実装によるズレもない。

**P0-2（キャンセルポリシーの統一）**：
`components/TermsPageContent.tsx`（利用規約）の記載（前日18時まで無料／前日18時以降・当日50%／無断キャンセル100%）を正しいベースラインとして確認。これ以外の箇所で以下の不整合を発見し修正：
- `lib/i18n.ts`のFAQ回答（TOPページFAQプレビュー・FAQページ・初めての方へページ、JA/EN各3箇所、計6箇所）：「キャンセルは前日の18時までとさせていただいております」という、以降は受付不可とも読める曖昧な表現を、「前日18:00まで無料、それ以降および当日は50%、無断キャンセルは100%」を明示する統一文言に変更。
- 同FAQ内のクレジットカード前払い時の返金案内：「50%を差し引いて返金」という固定表現（無断キャンセル＝100%の場合に矛盾しうる）を、「キャンセル料を差し引いた残額を返金」という、どの料率でも矛盾しない表現に修正。
- `components/PricingPageContent.tsx`の料金ページ注意事項（JA/EN）も同様に統一。
- 決済方法との整合性：利用規約2条「各種カード決済、または事前決済」とFAQの「クレジットカード前払い」案内に矛盾なし。
- 予約ページ（`BookingForm.tsx`）・予約受付メッセージ（`app/api/bookings/route.ts`）・メールテンプレート（`lib/email.ts`）には、現状キャンセルポリシーの文言自体が存在しないため「不統一」ではなく「非表示」と判断。デザイン変更を伴う新規追加はスコープ外として見送った。
- 見つけたが変更しなかった項目：`lib/i18n.ts`内の未使用キー`pricingPage.notes`に旧キャンセル文言が残存。grep確認の結果どのコンポーネントからも参照されていない死んだコード（現在の料金ページは`PricingPageContent.tsx`内のローカルcontentを使用）であり、表示に影響しないため今回は変更していない。

**P0-3（MIX / MASTERING単体サービスの追加）**：
`components/PricingPageContent.tsx`の料金ページに5枚目のカードとして追加（JA/EN）。¥20,000（税込・1曲）、初稿は約1週間目安、修正2回まで料金内、内容により追加作業は事前相談。既存カードと同一のスタイル（`glass-card`、タイポグラフィ、余白、カラー）を流用。CTA「メールで相談する」は既存の問い合わせフォーム（`/contact`）へリンク。`lib/pricing.ts`の`PLANS`（予約カレンダーが参照する予約プラン一覧）には追加していないため、3時間REC予約カレンダーの新しい予約プランとしては選択できない。既存の¥12,000・¥15,000・¥30,000〜・¥50,000〜は無変更。バッジ文言は初稿で「録音済みの方へ」/「For Existing Recordings」としていたが、他カードのバッジ（「For Release」等）より長く折り返して見えたため、「単体メニュー」/「Standalone」に短縮して統一感を調整した。

**テスト結果**：
- `tsc --noEmit`：エラーなし
- `next build`：成功（全18ルート生成）
- このプロジェクトには元々ESLint設定/スクリプトが存在しない（今回の変更とは無関係の既存状態）
- 予約期間境界値ロジックの単体テスト：全ケースPASS
- Playwright（ローカルscratchpadに`playwright@1.45.0`を一時インストール、プロジェクトの依存関係には追加せず）でPC（1440px）・モバイル（390px）・JA/ENのレイアウトを目視確認。崩れなし。MIX/MASTERINGカードは5枚目として4カラムグリッドの次行に自然に折り返し表示。

**公開後の確認結果（すべて読み取り操作。本番へのテスト予約・登録・送信は行っていない）**：

| 確認項目 | 結果 |
| --- | --- |
| サイトが生きているか（`GET /`） | 200 |
| `/pricing`にMIX/MASTERINGカードが表示されるか | 表示あり（「MIX / MASTERING」×3箇所、タグ「単体メニュー」、価格「¥20,000」を確認） |
| `/pricing`の注意事項に新キャンセル文言があるか | あり（「ご予約のキャンセルは、ご利用日前日の18:00まで無料です。」） |
| `/pricing`に旧キャンセル文言が残っていないか | 残っていない |
| `/faq`に新キャンセル文言があるか | あり（返金案内の修正後の文言まで含めて全文一致を確認） |
| `/faq`に旧キャンセル文言が残っていないか | 残っていない |

**重大な起動・表示不具合**：なし。切り戻しは行っていない。

**未確認事項**：なし（本件は表示文言とカード追加のみで、新しい計算ロジックや外部連携の変更を伴わないため）。

## 16. 本番公開（2026-10-24）— 予約カレンダーの日付変更時の不具合修正／Next.js 16.4.3へ更新

**対象コミット**：本コミット（`origin/main` の `7681394` の直後）
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-isq6m6ydq-neighxs-projects.vercel.app`（id `dpl_8eaLw1vUTnoS2ZfzXbaQGe7Ws4mf`、commit `7681394`）。`vercel rollback https://wuloong-studio-tokyo-isq6m6ydq-neighxs-projects.vercel.app` で戻せる。
**デプロイ手順**：前回までと同じ、GitHub連携（`git push origin main`）によるVercelの通常の自動ビルド・デプロイ。

**不具合**：予約フォームでA日の時刻を選んだ後にB日をクリックすると、カレンダー上はB日・時刻未選択になるが、フォーム側にはA日の日時が残り、そのまま送信するとA日の日時で申し込まれる経路があった。さらに、カレンダーの日付・時刻・月送りボタンに `type` 属性がなく、フォーム（`<form>`）内では送信ボタンとして扱われていたため、必須項目を入力済みの状態では日付や時刻をクリックしただけで、古い日時の申込が送信されていた（入力欄が空の場合はブラウザの必須項目チェックが表示されていた）。TOPページの「この日程で予約フォームへ進む」リンクにも、日付変更前の日時が残っていた。

**修正**：
- `components/BookingCalendar.tsx`：日付クリック時（同じ日付の再クリックを含む）に、親へ「日付＋時刻未選択」を通知。前月・翌月・日付・時刻ボタンに `type="button"` を指定。
- `components/BookingForm.tsx`：日付・時刻の両方が選ばれるまで送信ボタンを無効化（送信処理側の日時未選択ガードは従来どおり維持）。
- 予約API・Googleカレンダー連携・料金・3時間枠は無変更。

**依存関係**：`next` を 16.2.9 → 16.4.3 に更新（関連して `@next/env`・`@next/swc-*`・`@swc/helpers`、Next.js同梱の `postcss`・`nanoid`、`sharp` 0.34.5 → 0.35.5 が更新）。React・nodemailer等は据え置き。Next.js 16.4.1未満に該当していた公開アドバイザリ（画像最適化・`use cache`・Windows環境・`next/og`等）を解消。回帰テスト用に開発依存として `jsdom` 29.1.1 を追加（本番バンドルには含まれない）。

**回帰テスト**：`npm run test:booking`（`tests/booking-datetime.test.mjs`）。実際の `BookingForm`・`BookingCalendar`・TOP・予約ページを jsdom 上で操作し、日付変更・同日再クリック・初回選択・プラン変更・409・TOPの予約リンク・URL事前選択の9項目を検証（APIはモック）。

**公開前の確認**：`tsc --noEmit` エラーなし／`next build`（Next.js 16.4.3）成功／回帰テスト9項目PASS／既存APIの受付期間・3時間枠・競合・仮申込をmockモードで確認／ローカルの本番ビルドを実Chrome（デスクトップ幅・スマホ幅エミュレーション）で操作し、予約APIへの通信をブラウザ側でモック化した状態で日付変更・月送り・送信内容・TOPリンク・プラン変更・409・URL事前選択を確認／主要ページの表示・画像最適化（`/_next/image`）・日英切替を確認。

## 17. 予約・問い合わせの安全対策と GA4 計測の導入（2026-10-25 準備）

**対象**：公開済み `main`（`4a8490e`）を基準としたブランチ `release/booking-safety-ga4`。
**切り戻し先（直前の本番デプロイ）**：`https://wuloong-studio-tokyo-a6r8v0t0f-neighxs-projects.vercel.app`（id `dpl_Eceimo9arxbw64rbthb9uWXHpq9A`、commit `4a8490e`）。

**予約・問い合わせAPI**：
- 入力検証（`lib/validation.ts`）：JSONの `null`・型違い・文字数超過・不正なメール形式・複数宛先（カンマ等）・制御文字（改行等）を400で拒否。お問い合わせの件名は選択肢の値のみ。フォームの `maxLength` と上限を共有。
- 日時：実在日付（`isValidDateString`）、JSTの受付期間（従来どおり）、営業時間・3時間枠の開始時刻（`lib/booking-slots.ts` をクライアントと共用）、当日の開始済み時刻を400で拒否。
- 空き判定：カレンダーの予定の日時を時刻の数値に変換して比較（UTC表記・他タイムゾーン・終日予定・隣接予定に対応）。当日の開始済みの枠は空き状況から除外。
- 同じ申込の再送：同一プロセス内の排他処理の中でも受付番号を再確認し、同じ成功結果を返す（2回目が競合扱いにならない）。別インスタンス間の完全な排他は行わない（運用で確認）。
- メール：利用者入力をHTMLエスケープ（改行はエスケープ後に`<br>`）、件名の制御文字を除去。確認メールの送信に失敗しても申込は受付成功のまま、理由をカレンダーに記録。
- 回数制限（`lib/rate-limit.ts`、プロセス内メモリのみ）：送信元IPごとの受付制限（10分5件・1日20件、429）と、宛先ごとの確認メール送信枠（1時間3通・1日10通、超過時は確認メールのみ省略）。キー数の上限と期限あり。制約は `docs/booking-confirmation-runbook.md` に記載。

**予約画面**：URLの事前選択（plan/date/time）を検証し、不正・範囲外・開始済み・予約済みの時刻は選択を解除。事前選択した日付の月を表示。日時未選択時に送信できない理由を表示。

**GA4**：`NEXT_PUBLIC_GA_MEASUREMENT_ID` 設定時のみ gtag.js を読み込む既存の仕組みを使用。計測はページ閲覧（自動）、`booking_start`（フォームの入力開始、ページごとに1回）、`booking_submit_success`（申込APIが `pending_confirmation` を返した時のみ、同じ申込につき1回。予約確定ではない）。送る値は `plan_id`・`lang` のみで、受付番号・氏名・連絡先・相談内容は送らない。プライバシーポリシー（日英）をGoogle アナリティクスの利用内容に合わせて更新。

**テスト**：`npm run test:booking`（画面24項目・API52項目、外部通信なし）。
