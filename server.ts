import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("fan_crm.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS fans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    phone TEXT,
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    tier TEXT DEFAULT 'LITE',
    total_spent REAL DEFAULT 0,
    last_purchase_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fan_id INTEGER,
    amount REAL,
    purchase_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fan_id) REFERENCES fans(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fan_id INTEGER,
    type TEXT, -- 'EMAIL' or 'SMS'
    template_name TEXT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(fan_id) REFERENCES fans(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // 1. Collect Fan Data (Landing Page)
  app.post("/api/fans/collect", (req, res) => {
    const { email, phone, source, utm_source, utm_medium, utm_campaign } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO fans (email, phone, source, utm_source, utm_medium, utm_campaign)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          phone = excluded.phone,
          source = excluded.source
        RETURNING id
      `);
      const result = stmt.get(email, phone, source, utm_source, utm_medium, utm_campaign) as { id: number };
      res.json({ success: true, fanId: result.id });
    } catch (error) {
      res.status(500).json({ error: "Failed to collect fan data" });
    }
  });

  // 2. Purchase Verification & Tiering
  app.post("/api/fans/verify-purchase", (req, res) => {
    const { email, amount, purchaseCode } = req.body;
    try {
      const fan = db.prepare("SELECT id, total_spent FROM fans WHERE email = ?").get(email) as { id: number, total_spent: number };
      if (!fan) return res.status(404).json({ error: "Fan not found" });

      const newTotal = fan.total_spent + Number(amount);
      let tier = 'LITE';
      if (newTotal > 100) tier = 'CORE';
      else if (newTotal > 25) tier = 'MIDDLE';

      const updateFan = db.transaction(() => {
        db.prepare("INSERT INTO transactions (fan_id, amount, purchase_code) VALUES (?, ?, ?)").run(fan.id, amount, purchaseCode);
        db.prepare("UPDATE fans SET total_spent = ?, tier = ?, last_purchase_date = CURRENT_TIMESTAMP WHERE id = ?").run(newTotal, tier, fan.id);
      });
      updateFan();

      res.json({ success: true, tier });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify purchase" });
    }
  });

  // 3. Get All Fans
  app.get("/api/fans", (req, res) => {
    const fans = db.prepare("SELECT * FROM fans ORDER BY created_at DESC").all();
    res.json(fans);
  });

  // 4. Get Dashboard Stats
  app.get("/api/stats", (req, res) => {
    const stats = {
      totalFans: db.prepare("SELECT COUNT(*) as count FROM fans").get() as { count: number },
      tierCounts: db.prepare("SELECT tier, COUNT(*) as count FROM fans GROUP BY tier").all(),
      sourceCounts: db.prepare("SELECT utm_source, COUNT(*) as count FROM fans GROUP BY utm_source").all(),
      totalRevenue: db.prepare("SELECT SUM(total_spent) as total FROM fans").get() as { total: number }
    };
    res.json(stats);
  });

  // 5. Trigger Message
  app.post("/api/messages/send", (req, res) => {
    const { fanId, type, templateName } = req.body;
    try {
      db.prepare("INSERT INTO messages (fan_id, type, template_name) VALUES (?, ?, ?)").run(fanId, type, templateName);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to log message" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
