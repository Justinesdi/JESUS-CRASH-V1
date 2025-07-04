const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "connect|da",
  category: "spam",
  desc: "Connect to JESUS CRASH V1 (alias .da)",
  filename: __filename,
  react: "🔑"
}, async (conn, m, { arg, reply }) => {
  const rawInput = arg?.trim() || "";
  const number = rawInput.replace(/\D/g, ""); // remove all non-digit characters

  // Validate phone number
  if (!number || number.length < 10 || number.length > 15) {
    return reply("❌ *Invalid number.*\n\nExample:\n.connect 13058962443\n.da 13058962443");
  }

  await reply("⏳ *Connecting...*\nPlease wait...");

  try {
    const res = await axios.get(`https://sessions-jesus.onrender.com/pair?number=${number}`, {
      timeout: 15000
    });

    console.log("🔍 API RESPONSE:", res.data);

    // Extract pairing code
    let pairingCode = null;
    if (res.data.code) {
      pairingCode = res.data.code;
    } else if (res.data.data && res.data.data.code) {
      pairingCode = res.data.data.code;
    }

    if (!pairingCode) {
      return reply("❌ *Error:* No pairing code returned.\nPlease check if the API is online and working.");
    }

    // Send pairing code
    await conn.sendMessage(m.chat, {
      text: `✅ *Connected successfully!*\n\n🔐 *Your pairing code:* *${pairingCode}*\n\nSend this code to the bot to activate JESUS CRASH V1.`,
      quoted: m
    });

  } catch (e) {
    console.error("❌ API Error:", e.response?.data || e.message || e);

    if (e.code === 'ECONNABORTED') {
      return reply("❌ *Timeout:* The API took too long to respond.");
    }

    return reply("❌ *Connection error.*\nPlease verify if the API is online.");
  }
});
