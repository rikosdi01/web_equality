const { Client } = require("pg");
const { wss } = require("../../app"); // ✅ ambil wss, bukan WebSocket
const dotenv = require("dotenv");
dotenv.config();

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

pgClient.connect();
pgClient.query("LISTEN update_channel");

pgClient.on("notification", (msg) => {
  console.log("🔔 Notifikasi PostgreSQL:", msg.payload);

  // ✅ Gunakan wss.clients untuk broadcast
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg.payload);
    }
  });
});

pgClient.on("error", (err) => {
  console.error("PostgreSQL listener error:", err);
});
