/**
 * 予約枠（営業時間と開始時刻）の定義。サーバー（空き状況・予約API）とクライアント（予約画面）で共用する。
 * 外部サービスに依存しないため、クライアントコンポーネントからも読み込める。
 */
export const STUDIO_OPEN_HOUR = 10
export const STUDIO_CLOSE_HOUR = 22

/** 指定の所要時間で予約できる開始時刻（時）の一覧。終了が閉店時刻を超えない枠だけ。 */
export function studioStartHours(durationHours: number): number[] {
  const starts: number[] = []
  for (let h = STUDIO_OPEN_HOUR; h + durationHours <= STUDIO_CLOSE_HOUR; h++) starts.push(h)
  return starts
}

/**
 * 指定の所要時間で予約を受け付ける開始時刻か（"HH:mm"、空き状況APIが返す枠と同じ定義）。
 * 営業時間外・正時以外など、枠として存在しない時刻は false。
 */
export function isAllowedStartTime(time: string, durationHours: number): boolean {
  return studioStartHours(durationHours).some((h) => `${String(h).padStart(2, "0")}:00` === time)
}
