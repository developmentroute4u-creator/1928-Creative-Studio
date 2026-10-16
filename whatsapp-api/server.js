require("dotenv").config();

const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
app.use(express.json({ limit: "50kb" }));

const API_SECRET = process.env.API_SECRET;
const PORT = Number(process.env.PORT) || 3000;

if (!API_SECRET || API_SECRET.length < 24) {
  throw new Error(
    "Set API_SECRET to a random secret of at least 24 characters in .env",
  );
}

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "my-local-php-project",
  }),
  puppeteer: {
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

let isReady = false;
const inbox = [];
const MAX_INBOX_MESSAGES = 100;

function validPhone(phone) {
  return typeof phone === "string" && /^\d{8,15}$/.test(phone);
}

function requireApiSecret(req, res, next) {
  if (req.get("x-api-secret") !== API_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

client.on("qr", (qr) => {
  console.log("Scan this QR code using WhatsApp > Linked devices:");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("WhatsApp authenticated successfully!");
});

client.on("ready", () => {
  isReady = true;
  console.log("WhatsApp connected and ready!");
});

client.on("auth_failure", (message) => {
  isReady = false;
  console.error("WhatsApp authentication failed:", message);
});

client.on("disconnected", (reason) => {
  isReady = false;
  console.error("WhatsApp disconnected:", reason);
});

// Receive incoming WhatsApp messages.
client.on("message", (message) => {
  if (message.fromMe) return;

  const incoming = {
    from: message.from,
    body: message.body || "",
    type: message.type || "unknown",
    timestamp: message.timestamp || Math.floor(Date.now() / 1000),
  };

  inbox.unshift(incoming);

  if (inbox.length > MAX_INBOX_MESSAGES) {
    inbox.pop();
  }

  console.log(
    "\nIncoming WhatsApp message\n" +
      `From: ${incoming.from}\n` +
      `Type: ${incoming.type}\n` +
      `Message: ${incoming.body || "[No text content]"}\n`,
  );
});

// Log delivery acknowledgements for troubleshooting.
client.on("message_ack", (message, ack) => {
  console.log("[WhatsApp ACK]", {
    id: message?.id?._serialized ?? null,
    to: message?.to ?? null,
    ack,
  });
});

app.get("/status", (req, res) => {
  res.json({ connected: isReady });
});

// Retrieve recent incoming messages.
app.get("/inbox", requireApiSecret, (req, res) => {
  res.json({
    connected: isReady,
    count: inbox.length,
    messages: inbox,
  });
});

async function sendToWhatsAppNumber(number, message, label) {
  const digits = String(number ?? "").replace(/\D/g, "");

  if (!validPhone(digits)) {
    throw new Error(`${label}: Invalid phone number`);
  }

  const recipient = await client.getNumberId(digits);

  if (!recipient || !recipient._serialized) {
    throw new Error(
      `${label}: WhatsApp could not resolve this number. ` +
        "Check the country code and confirm the number has WhatsApp.",
    );
  }

  console.log(`[${label}] Resolved recipient: ${recipient._serialized}`);

  const result = await client.sendMessage(recipient._serialized, message);

  console.log(`[${label}] sendMessage result:`, {
    resultAvailable: Boolean(result),
    messageId: result?.id?._serialized ?? null,
    recipientId: result?.to ?? recipient._serialized,
    ack: result?.ack ?? null,
  });

  // In this environment, sendMessage can return no message object
  // even though WhatsApp sends the message. Don't report failure
  // solely because the return object is missing.
  return {
    sent: true,
    recipientId: recipient._serialized,
    messageId: result?.id?._serialized ?? null,
    returnObjectAvailable: Boolean(result),
  };
}

// Send a WhatsApp confirmation to the customer ONLY.
app.post("/send-form-notifications", requireApiSecret, async (req, res) => {
  if (!isReady) {
    return res.status(503).json({
      success: false,
      error: "WhatsApp is not connected",
    });
  }

  const { name, phone } = req.body || {};

  if (typeof name !== "string" || !name.trim() || !validPhone(phone)) {
    return res.status(400).json({
      success: false,
      error: "Missing or invalid customer name or phone number",
    });
  }

  const safe = (value, max = 1500) =>
    String(value ?? "")
      .trim()
      .slice(0, max) || "Not provided";

  const customerMessage =
    `Hello ${safe(name, 150)},\n\n` +
    "Thank you for submitting your project brief to 1928 Creative Studio. " +
    "We have received your details and will get back to you within 72 hours.\n\n" +
    "Team 1928 Creative Studio";

  try {
    const result = await sendToWhatsAppNumber(
      phone,
      customerMessage,
      "Customer",
    );

    return res.status(200).json({
      success: true,
      customerSent: result.sent,
      message: "Customer WhatsApp send operation completed successfully.",
    });
  } catch (error) {
    console.error("[Customer WhatsApp error]", error.stack || error.message);

    return res.status(502).json({
      success: false,
      customerSent: false,
      error: error.message,
    });
  }
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`WhatsApp API running at http://127.0.0.1:${PORT}`);
});

client.initialize().catch((error) => {
  console.error("WhatsApp initialization failed:", error);
});
