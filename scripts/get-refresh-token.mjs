/**
 * Run once to get a Google OAuth refresh token.
 *
 * Usage:
 *   node scripts/get-refresh-token.mjs
 *
 * Prerequisites:
 *   npm install googleapis
 *   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 */

import { createInterface } from "readline"
import { google } from "googleapis"

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"

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

console.log("\n1. Open this URL in your browser:\n")
console.log(authUrl)
console.log("\n2. Allow access, then paste the code below:\n")

const rl = createInterface({ input: process.stdin, output: process.stdout })
rl.question("Code: ", async (code) => {
  rl.close()
  const { tokens } = await oauth2Client.getToken(code.trim())
  console.log("\n✅ Add these to your .env.local:\n")
  console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
  console.log("\nDone!")
})
