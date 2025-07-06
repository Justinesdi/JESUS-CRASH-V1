const { default: axios } = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "pair",
  alias: ["session", "pair", "paircode", "qrcode"],
  category: "main",
  desc: "Generate a WhatsApp pairing code",
  filename: __filename,
}, async (conn, m, { arg, repondre }) => {
  try {
    if (!arg || arg.length === 0) {
      return repondre("*Please provide a number in the format: 1305......*");
    }

    await repondre("*Please wait JESUS-CRASH-V1... Generating pair code*");

    const encodedNumber = encodeURIComponent(arg.join(" "));
    const apiUrl = `https://sessions-jesus.onrender.com/code?number=${encodedNumber}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data?.code) {
      await repondre(data.code);
      await repondre("*Copy the above code and use it to link your WhatsApp via linked devices*");
    } else {
      throw new Error("Invalid response from API - no code found");
    }
  } catch (error) {
    console.error("Error getting API response:", error.message);
    return repondre("❌ Error: Could not get response from the pairing service.");
  }
});