// テスト用の googleapis 代替（外部通信なし）。予約APIの test モードの実コード経路を、
// メモリ上の偽カレンダーで動かす。globalThis.__fakeCalendar で予定の追加・確認ができる。
// 仮定: 実在しない日付の dateTime は insert で 400 として拒否する（実Googleの挙動は未確認）。
const cal = (globalThis.__fakeCalendar ??= { events: [], latencyMs: 5, seq: 0 })
const sleep = () => new Promise((r) => setTimeout(r, cal.latencyMs))
const toMs = (x) => Date.parse(x.dateTime ?? `${x.date}T00:00:00+09:00`)
const realDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})T/.exec(s ?? "")
  if (!m) return false
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3]
}

export const google = {
  auth: { OAuth2: class { setCredentials() {} } },
  calendar() {
    return {
      events: {
        async list({ timeMin, timeMax, q }) {
          await sleep()
          const s = Date.parse(timeMin), e = Date.parse(timeMax)
          // 日時を解析できない予定は範囲判定できないため、そのまま返す（アプリ側の安全側の扱いを検証するため）
          let items = cal.events.filter((ev) => Number.isNaN(toMs(ev.start)) || Number.isNaN(toMs(ev.end)) || (toMs(ev.start) < e && toMs(ev.end) > s))
          if (q) items = items.filter((ev) => `${ev.summary ?? ""}\n${ev.description ?? ""}`.includes(q))
          return { data: { items: structuredClone(items) } }
        },
        async insert({ requestBody }) {
          await sleep()
          if (!realDate(requestBody.start?.dateTime)) {
            const err = new Error("Bad Request: invalid start dateTime")
            err.code = 400
            throw err
          }
          const id = `fake-${++cal.seq}`
          cal.events.push({ id, ...structuredClone(requestBody) })
          return { data: { id } }
        },
        async get({ eventId }) {
          await sleep()
          return { data: structuredClone(cal.events.find((ev) => ev.id === eventId) ?? {}) }
        },
        async patch({ eventId, requestBody }) {
          await sleep()
          const ev = cal.events.find((x) => x.id === eventId)
          if (ev) Object.assign(ev, requestBody)
          return { data: structuredClone(ev ?? {}) }
        },
      },
    }
  },
}
