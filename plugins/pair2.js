const { default: axios } = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "pair",
  alias: ["session", "paircode", "qrcode"],
  category: "main",
  desc: "Generate a WhatsApp pair code for login",
  filename: __filename,
}, async (conn, m, { repondre, arg }) => {
  try {
    if (!arg || arg.length === 0) {
      return repondre("📌 *Example:* .pair 509xxxx");
    }

    await repondre("🔄 *Wait... Generating your pair code ✅...*");

    const phoneNumber = encodeURIComponent(arg.join(" "));
    const apiUrl = `https://sessions-jesus-crash.onrender.com/pair${phoneNumber}`;
    
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.code) {
      await repondre(data.code);
      await repondre("📲 *Here is your pair code.*\nCopy and paste it in the Linked Devices prompt.");
    } else {
      throw new Error("No code found in API response.");
    }
  } catch (err) {
    console.error("Pair Code Error:", err.message);
    await repondre("❌ *Error getting pair code. Try again later.*");
  }
});