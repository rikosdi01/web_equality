const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const equalityRoutes = require('./src/routes/equalityRoutes.js');
const itemRoutes = require('./src/routes/itemRoutes.js');
const dbHealthCheck = require("./src/middlewares/dbHealthCheck.js");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(dbHealthCheck);

app.use(cors({
    origin: 'http://localhost:15691',
    credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/equalities", equalityRoutes);
app.use("/items", itemRoutes);

const server = http.createServer(app);

const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send(JSON.stringify({ message: 'Welcome!' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running with WebSocket on http://localhost:${PORT}`);
});

// ⬇️ Pindahkan ini ke bawah, setelah `wss` dideklarasikan & diekspor
module.exports = { server, wss };
require("./src/config/postgresListener.js"); // ✅ Sekarang `wss` sudah ada
