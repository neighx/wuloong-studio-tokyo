/**
 * 予約・お問い合わせAPIの入力検証。
 *
 * 入力はメール本文・件名やカレンダーのイベントに使われるため、サーバー側で
 * 型・必須・形式・文字数を必ず検証する（フロントの検証は回避され得る）。
 * 文字数上限はフォームの maxLength と同じ値を共有し、画面で入力できる範囲と
 * APIが受け付ける範囲を揃える。長さは maxLength と同じく UTF-16 の code unit 数で数える。
 */
import { t } from "./i18n"

export const FIELD_LIMITS = {
  name: 100,
  email: 254, // RFC 5321 のアドレス長の上限
  phone: 30,
  instagram: 64,
  bookingMessage: 2000,
  contactMessage: 5000,
  planName: 100,
  idempotencyKey: 100,
} as const

// 1行で使う項目（件名・宛先・ヘッダーに入り得るもの）は改行を含む制御文字をすべて拒否する。
const SINGLE_LINE_FORBIDDEN = /[\u0000-\u001F\u007F\u2028\u2029]/
// 複数行の項目は改行・タブのみ許可する。
const MULTI_LINE_FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

// HTMLの <input type="email"> と同じ規則（WHATWG）に、ドメインのドットを必須とする条件を加えたもの。
// カンマ・空白・山括弧・引用符を含められないため、複数宛先の指定やヘッダー注入には使えない。
const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

const CONTACT_SUBJECTS = new Set<string>(t.ja.contactPage.subjectOptions.map((o) => o.value))

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string }

type FieldSpec = { required: boolean; max: number; multiline?: boolean }

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/** 文字列項目を検証する。エラー時はメッセージ、正常時は null を返す。 */
function checkString(obj: Record<string, unknown>, key: string, spec: FieldSpec): string | null {
  const v = obj[key]
  if (v === undefined || v === null || v === "") {
    return spec.required ? `Missing required field: ${key}` : null
  }
  if (typeof v !== "string") return `Invalid type for ${key}: expected string`
  if (spec.required && v.trim() === "") return `Missing required field: ${key}`
  if (v.length > spec.max) return `${key} is too long (max ${spec.max} characters)`
  if ((spec.multiline ? MULTI_LINE_FORBIDDEN : SINGLE_LINE_FORBIDDEN).test(v)) {
    return `${key} contains invalid characters`
  }
  return null
}

function checkEmail(obj: Record<string, unknown>, key: string): string | null {
  const err = checkString(obj, key, { required: true, max: FIELD_LIMITS.email })
  if (err) return err
  return EMAIL_PATTERN.test(obj[key] as string) ? null : `Invalid email address: ${key}`
}

function optionalString(v: unknown): string | undefined {
  return typeof v === "string" && v !== "" ? v : undefined
}

export interface ValidBookingInput {
  planId: string
  planName: string
  date: string
  time: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerInstagram?: string
  message?: string
  isFirstTime: boolean
  idempotencyKey?: string
}

/**
 * 予約APIの入力の型・必須・文字数・形式を検証する。
 * date/time はここでは書式のみ確認し、実在日付・受付期間・予約枠の判定は呼び出し側で行う。
 */
export function validateBookingInput(body: unknown): ValidationResult<ValidBookingInput> {
  if (!isPlainObject(body)) return { ok: false, error: "Invalid request body" }

  const errors = [
    checkString(body, "planId", { required: true, max: 50 }),
    checkString(body, "planName", { required: true, max: FIELD_LIMITS.planName }),
    checkString(body, "date", { required: true, max: 10 }),
    checkString(body, "time", { required: true, max: 5 }),
    checkString(body, "customerName", { required: true, max: FIELD_LIMITS.name }),
    checkEmail(body, "customerEmail"),
    checkString(body, "customerPhone", { required: true, max: FIELD_LIMITS.phone }),
    checkString(body, "customerInstagram", { required: false, max: FIELD_LIMITS.instagram }),
    checkString(body, "message", { required: false, max: FIELD_LIMITS.bookingMessage, multiline: true }),
    checkString(body, "idempotencyKey", { required: false, max: FIELD_LIMITS.idempotencyKey }),
  ].filter((e): e is string => e !== null)
  if (errors.length > 0) return { ok: false, error: errors[0] }

  if (body.isFirstTime !== undefined && typeof body.isFirstTime !== "boolean") {
    return { ok: false, error: "Invalid type for isFirstTime: expected boolean" }
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(body.time as string)) {
    return { ok: false, error: "Invalid time format. Use HH:mm" }
  }

  return {
    ok: true,
    value: {
      planId: body.planId as string,
      planName: body.planName as string,
      date: body.date as string,
      time: body.time as string,
      customerName: body.customerName as string,
      customerEmail: body.customerEmail as string,
      customerPhone: body.customerPhone as string,
      customerInstagram: optionalString(body.customerInstagram),
      message: optionalString(body.message),
      isFirstTime: body.isFirstTime === true,
      idempotencyKey: optionalString(body.idempotencyKey),
    },
  }
}

export interface ValidContactInput {
  name: string
  email: string
  subject: string
  message: string
}

/** お問い合わせAPIの入力を検証する。件名はフォームの選択肢の値のみ受け付ける。 */
export function validateContactInput(body: unknown): ValidationResult<ValidContactInput> {
  if (!isPlainObject(body)) return { ok: false, error: "Invalid request body" }

  const errors = [
    checkString(body, "name", { required: true, max: FIELD_LIMITS.name }),
    checkEmail(body, "email"),
    checkString(body, "subject", { required: false, max: 50 }),
    checkString(body, "message", { required: true, max: FIELD_LIMITS.contactMessage, multiline: true }),
  ].filter((e): e is string => e !== null)
  if (errors.length > 0) return { ok: false, error: errors[0] }

  const subject = optionalString(body.subject) ?? ""
  if (subject !== "" && !CONTACT_SUBJECTS.has(subject)) {
    return { ok: false, error: "Invalid subject" }
  }

  return {
    ok: true,
    value: {
      name: body.name as string,
      email: body.email as string,
      subject,
      message: body.message as string,
    },
  }
}
