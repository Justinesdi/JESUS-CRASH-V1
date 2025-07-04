const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "connect|da ?(.*)",
  category: "spam",
  desc: "Connect to JESUS CRASH V1 (alias .da)",
  filename: __filename,
  react: "🔑"
}, async (conn, m, { arg, reply }) => {
  const rawInput = arg?.trim() || "";
  const number = rawInput.replace(/\D/g, ""); // retire tout sa ki pa chif

  // ✅ Validate number
  if (!number || number.length < 11) {
    return reply("❌ *Nimewo pa valab.*\n\nEgzanp kòrèk:\n.connect 13058962443\n.da 13058962443");
  }

  // 🔄 Processing
  await reply("⏳ *Y ap konekte...*\nTanpri tann...");

  try {
    // ⏱️ Fè demann lan ak 15s timeout
    const res = await axios.get(`https://sessions-jesus.onrender.com/pair?number=${number}`, {
      timeout: 15000
    });

    console.log("🔍 API response:", res.data);

    const { code } = res.data;

    if (!code) {
      return reply("❌ *Erè:* Pa gen kòd retounen nan API a.\nTcheke si sèvis la aktif.");
    }

    // ✅ Siksè: voye kòd la
    await conn.sendMessage(m.chat, {
      text: `✅ *Koneksyon Reyisi!*\n\n🔐 *Kòd ou:* *${code}*\n\nVoye kòd sa bay bot la pou aktive JESUS CRASH V1.`,
      quoted: m
    });

  } catch (e) {
    // ⛔️ Log tout erè
    console.error("❌ Error:", e.response?.data || e.message || e);

    if (e.code === 'ECONNABORTED') {
      return reply("❌ *Timeout:* Sèvis la pran twòp tan pou reponn.");
    }

    return reply("❌ *Erè pandan koneksyon.*\nTcheke si API a ap mache sou Render.");
  }
});
