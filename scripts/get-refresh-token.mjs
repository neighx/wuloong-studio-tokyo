/**
 * Run once to get a Google OAuth refresh token.
 *
 * Usage:
 *   node --env-file=.env.local scripts/get-refresh-token.mjs
 */

import { createServer } from "http"
import { google } from "googleapis"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = "http://localhost:3099/oauth/callback"
const PORT = 3099

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local")
  process.exit(1)
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar"],
  prompt: "consent",
})

console.log("\n1. ブラウザで以下のURLを開いてください:\n")
console.log(authUrl)
console.log("\n2. wuloong.music@gmail.com でログインして許可してください。")
console.log("   自動的にリフレッシュトークンが取得されます。\n")

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth/callback")) return
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const code = url.searchParams.get("code")
  if (!code) {
    res.end("Error: no code")
    return
  }
  try {
    const { tokens } = await oauth2Client.getToken(code)
    res.end("<h2>✅ 成功！ターミナルを確認してください。</h2>")
    console.log("\n✅ .env.local に追加してください:\n")
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log("\nDone!")
  } catch (e) {
    res.end("Error: " + e.message)
    console.error(e)
  }
  server.close()
  process.exit(0)
})

server.listen(PORT)
