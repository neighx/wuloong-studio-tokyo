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
