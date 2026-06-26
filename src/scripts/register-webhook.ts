import { env } from "../schemas/env.js";

async function registerWebhook() {
  const webhookUrl = `${env.WEBHOOK_URL}/webhook/${env.TELEGRAM_BOT_TOKEN}`;
  const apiBase = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

  console.log(`Registering webhook: ${webhookUrl}`);

  const res = await fetch(`${apiBase}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message"],
    }),
  });

  const data = (await res.json()) as { ok: boolean; description?: string };

  if (data.ok) {
    console.log("Webhook registered successfully");
  } else {
    console.error("Failed to register webhook:", data.description);
    process.exit(1);
  }
}

registerWebhook();
