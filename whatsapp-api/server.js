require("dotenv").config();

const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcodeTerminal = require("qrcode-terminal");
const QRCode = require("qrcode");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const API_SECRET = process.env.API_SECRET;
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

if (!API_SECRET || API_SECRET.length < 24) {
  throw new Error(
    "Set API_SECRET to a random secret of at least 24 characters in .env"
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. ADMIN CREDENTIALS & .ENV MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

const ENV_PATH = path.join(__dirname, ".env");

function updateEnvFile(updates) {
  let content = "";
  if (fs.existsSync(ENV_PATH)) {
    content = fs.readFileSync(ENV_PATH, "utf8");
  }

  for (const [key, val] of Object.entries(updates)) {
    process.env[key] = String(val);
    const regex = new RegExp(`^${key}=.*$`, "m");
    const line = `${key}="${String(val).replace(/"/g, '\\"')}"`;
    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      content = (content.trim() + "\n" + line).trim() + "\n";
    }
  }

  fs.writeFileSync(ENV_PATH, content, "utf8");
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  return {
    hasCredentials: Boolean(username && password),
    username: username || "",
    password: password || "",
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. SESSION MANAGEMENT
// ══════════════════════════════════════════════════════════════════════════════

const sessions = new Map();
const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    username,
    expiresAt: Date.now() + SESSION_TTL,
  });
  return token;
}

function verifySession(req) {
  const token = req.cookies?.admin_session;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function destroySession(req) {
  const token = req.cookies?.admin_session;
  if (token) {
    sessions.delete(token);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. WHATSAPP CLIENT SETUP (CROSS-PLATFORM CHROMIUM DETECTION)
// ══════════════════════════════════════════════════════════════════════════════

function getPuppeteerOptions() {
  const args = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--no-first-run",
    "--no-zygote",
    "--disable-gpu",
  ];

  const options = {
    headless: true,
    args,
  };

  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    options.executablePath = process.env.CHROME_BIN;
    return options;
  }

  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        options.executablePath = p;
        break;
      }
    }
  } else if (process.platform === "linux") {
    const linuxCandidates = [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ];
    for (const p of linuxCandidates) {
      if (fs.existsSync(p)) {
        options.executablePath = p;
        break;
      }
    }
  }

  return options;
}

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "1928-creative-studio-session",
  }),
  puppeteer: getPuppeteerOptions(),
});

let isReady = false;
let latestQrRaw = null;
let latestQrDataUrl = null;
let qrGeneratedAt = null;
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

// WhatsApp Event Listeners
client.on("qr", async (qr) => {
  latestQrRaw = qr;
  qrGeneratedAt = Date.now();
  console.log("\nScan this QR code using WhatsApp > Linked devices (Terminal):");
  qrcodeTerminal.generate(qr, { small: true });

  try {
    latestQrDataUrl = await QRCode.toDataURL(qr, {
      width: 360,
      margin: 2,
      color: {
        dark: "#0b0f19",
        light: "#ffffff",
      },
    });
    console.log("[Dashboard] WhatsApp QR code generated for browser display at /");
  } catch (err) {
    console.error("Error generating QR code data URL:", err);
  }
});

client.on("authenticated", () => {
  console.log("WhatsApp authenticated successfully!");
  latestQrRaw = null;
  latestQrDataUrl = null;
});

client.on("ready", () => {
  isReady = true;
  latestQrRaw = null;
  latestQrDataUrl = null;
  console.log("WhatsApp connected and ready!");
});

client.on("auth_failure", (message) => {
  isReady = false;
  latestQrRaw = null;
  latestQrDataUrl = null;
  console.error("WhatsApp authentication failed:", message);
});

client.on("disconnected", (reason) => {
  isReady = false;
  latestQrRaw = null;
  latestQrDataUrl = null;
  console.error("WhatsApp disconnected:", reason);
});

// Receive incoming WhatsApp messages
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
      `Message: ${incoming.body || "[No text content]"}\n`
  );
});

client.on("message_ack", (message, ack) => {
  console.log("[WhatsApp ACK]", {
    id: message?.id?._serialized ?? null,
    to: message?.to ?? null,
    ack,
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4. CORE MESSAGE DISPATCH FUNCTION
// ══════════════════════════════════════════════════════════════════════════════

async function sendToWhatsAppNumber(number, message, label) {
  const digits = String(number ?? "").replace(/\D/g, "");

  if (!validPhone(digits)) {
    throw new Error(`${label}: Invalid phone number`);
  }

  const recipient = await client.getNumberId(digits);

  if (!recipient || !recipient._serialized) {
    throw new Error(
      `${label}: WhatsApp could not resolve this number. ` +
        "Check the country code and confirm the number has WhatsApp."
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

  return {
    sent: true,
    recipientId: recipient._serialized,
    messageId: result?.id?._serialized ?? null,
    returnObjectAvailable: Boolean(result),
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. PUBLIC & EXTERNAL API ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// Health check endpoint
app.get("/status", (req, res) => {
  res.json({ connected: isReady });
});

// Form notification endpoint used by send-contact-form_ack.php
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
      "Customer"
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

// Retrieve recent incoming messages via API secret
app.get("/inbox", requireApiSecret, (req, res) => {
  res.json({
    connected: isReady,
    count: inbox.length,
    messages: inbox,
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 6. DASHBOARD & AUTHENTICATION ENDPOINTS
// ══════════════════════════════════════════════════════════════════════════════

const dashboardHtmlPath = path.join(__dirname, "dashboard.html");

function serveDashboard(req, res) {
  if (fs.existsSync(dashboardHtmlPath)) {
    return res.sendFile(dashboardHtmlPath);
  }
  return res.status(404).send("dashboard.html template file not found.");
}

app.get("/", serveDashboard);
app.get("/admin", serveDashboard);
app.get("/dashboard", serveDashboard);
app.get("/login", serveDashboard);

// Return dashboard state & QR code
app.get("/api/dashboard-status", (req, res) => {
  const { hasCredentials, username } = getAdminCredentials();
  const session = verifySession(req);

  if (!session) {
    return res.status(401).json({
      authenticated: false,
      hasCredentials,
    });
  }

  return res.json({
    authenticated: true,
    username: session.username || username,
    hasCredentials,
    connected: isReady,
    qrDataUrl: latestQrDataUrl,
    qrAge: qrGeneratedAt ? Math.floor((Date.now() - qrGeneratedAt) / 1000) : null,
    inbox: inbox.slice(0, 25),
    apiSecret: API_SECRET,
  });
});

// First-time setup: save credentials to .env
app.post("/api/setup", (req, res) => {
  const { hasCredentials } = getAdminCredentials();
  if (hasCredentials) {
    return res.status(400).json({
      success: false,
      error: "Admin credentials already configured. Please log in.",
    });
  }

  const { username, password } = req.body || {};
  if (!username || !username.trim() || !password || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Username required, and password must be at least 6 characters.",
    });
  }

  try {
    updateEnvFile({
      ADMIN_USERNAME: username.trim(),
      ADMIN_PASSWORD: password,
    });

    const token = createSession(username.trim());
    res.cookie("admin_session", token, {
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      sameSite: "lax",
      maxAge: SESSION_TTL,
    });

    return res.json({ success: true, message: "Credentials saved to .env" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Login using credentials stored in .env
app.post("/api/login", (req, res) => {
  const { hasCredentials, username: savedUser, password: savedPass } = getAdminCredentials();

  if (!hasCredentials) {
    return res.status(400).json({
      success: false,
      error: "No admin credentials configured in .env yet. Please run setup.",
    });
  }

  const { username, password } = req.body || {};

  if (
    username === savedUser &&
    password === savedPass
  ) {
    const token = createSession(username);
    res.cookie("admin_session", token, {
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      sameSite: "lax",
      maxAge: SESSION_TTL,
    });

    return res.json({ success: true, message: "Logged in successfully" });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid admin username or password.",
  });
});

// Logout
app.post("/api/logout", (req, res) => {
  destroySession(req);
  res.clearCookie("admin_session");
  return res.json({ success: true });
});

// Update credentials and rewrite .env
app.post("/api/change-credentials", (req, res) => {
  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { username, password } = req.body || {};
  if (!username || !username.trim()) {
    return res.status(400).json({ success: false, error: "Username is required." });
  }

  const updates = { ADMIN_USERNAME: username.trim() };
  if (password && password.trim()) {
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters.",
      });
    }
    updates.ADMIN_PASSWORD = password;
  }

  try {
    updateEnvFile(updates);
    session.username = username.trim();
    return res.json({ success: true, message: "Credentials updated in .env" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Send quick test WhatsApp message from dashboard
app.post("/api/test-message", async (req, res) => {
  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  if (!isReady) {
    return res.status(503).json({
      success: false,
      error: "WhatsApp is not connected yet. Please scan the QR code first.",
    });
  }

  const { phone, message } = req.body || {};
  if (!phone || !validPhone(String(phone).replace(/\D/g, ""))) {
    return res.status(400).json({
      success: false,
      error: "Please provide a valid phone number with country code (e.g. 919876543210).",
    });
  }

  try {
    const result = await sendToWhatsAppNumber(
      phone,
      message || "Test message from 1928 Creative Studio WhatsApp Gateway",
      "Admin Test"
    );

    return res.json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Disconnect & re-initialize client to generate a new QR code
app.post("/api/reconnect", async (req, res) => {
  const session = verifySession(req);
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    isReady = false;
    latestQrRaw = null;
    latestQrDataUrl = null;

    try {
      await client.logout();
    } catch (e) {
      // client might not be connected
    }

    setTimeout(() => {
      client.initialize().catch((err) => {
        console.error("Re-initialization error:", err);
      });
    }, 1200);

    return res.json({
      success: true,
      message: "Disconnecting and generating a fresh QR code...",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// 7. START SERVER & INITIALIZE WHATSAPP
// ══════════════════════════════════════════════════════════════════════════════

app.listen(PORT, HOST, () => {
  console.log(`
  ════════════════════════════════════════════════════════════
    1928 CREATIVE STUDIO — WHATSAPP GATEWAY & DASHBOARD
  ════════════════════════════════════════════════════════════
  - Dashboard URL: http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/
  - Webhook:       http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/send-form-notifications
  - Admin User:    ${process.env.ADMIN_USERNAME || "(Setup required)"}
  ════════════════════════════════════════════════════════════
  `);
});

client.initialize().catch((error) => {
  console.error("WhatsApp initialization failed:", error);
});
