// netlify/functions/chat.js
export default async function handler(event) {
  if (event.httpMethod !== "POST") {
    return response(405, { error: "Method not allowed" })
  }

  let body
  try {
    body = JSON.parse(event.body || "{}")
  } catch {
    return response(400, { error: "Invalid JSON" })
  }
  const msg = (body.message || "").toString().trim()
  if (!msg) return response(400, { error: "Message is required" })

  const results = { notified: false, reply: "" }

  // Slack notify if configured
  try {
    const hook = process.env.SLACK_WEBHOOK_URL
    if (hook) {
      await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `New site chat message\n${msg}` })
      })
      results.notified = true
    }
  } catch {}

  // Optional AI reply
  try {
    const key = process.env.OPENAI_API_KEY
    if (key) {
      const prompt = `You are a helpful concierge for a Hampton Bays luxury rental with 4 bedrooms, 5 baths, heated saltwater pool, sleeps 10, minutes from Shinnecock Hills. Be concise and friendly. If asked about availability, explain that the team will confirm by email after an inquiry is submitted on the Contact section.`

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: msg }
          ],
          temperature: 0.4,
          max_tokens: 220
        })
      })

      if (!aiRes.ok) {
        results.reply = "Thanks. We received your message"
      } else {
        const data = await aiRes.json()
        results.reply = data?.choices?.[0]?.message?.content?.trim() || "Thanks. We received your message"
      }
    } else {
      results.reply = "Thanks. We received your message and will get back to you shortly"
    }
  } catch {
    results.reply = "Thanks. We received your message"
  }

  return response(200, results)
}

function response(status, obj) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(obj)
  }
}
