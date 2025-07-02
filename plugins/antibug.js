const { cmd } = require('../command');

let antiBugOn = false; // Initial state

// Unicode cleaner
const cleanText = (text) => {
  return text
    .replace(/[\u200B-\u200F\u061C\u180E\u2060-\u206F]/g, '') // Zero-width, RTL, bidi
    .replace(/[^\x20-\x7E\n\r]/g, ''); // Only clean ASCII
};

// Command to toggle antibug
cmd({
  pattern: "antibug ?(.*)",
  desc: "Toggle Anti-Bug Protection",
  category: "protection",
  react: "🛡️",
  filename: __filename
}, async (conn, m, { arg, reply }) => {
  const input = arg?.toLowerCase();

  if (input === "on") {
    antiBugOn = true;
    return await reply("✅ *AntiBug Activated!*\nSuspicious Unicode will now be auto-deleted.");
  } else if (input === "off") {
    antiBugOn = false;
    return await reply("🚫 *AntiBug Deactivated.*\nUnicode protection is now disabled.");
  } else {
    return await reply(`🛡️ *AntiBug Status:* ${antiBugOn ? "ON ✅" : "OFF ❌"}\n\nUse *.antibug on* or *.antibug off*`);
  }
});

// Middleware pou bloke Unicode si antibug active
cmd({
  pattern: ".*",
  dontAddCommandList: true,
  fromMe: false,
  filename: __filename
}, async (conn, m, { next }) => {
  if (antiBugOn && /[\u200B-\u200F\u061C\u180E\u2060-\u206F]/.test(m.body)) {
    return await conn.sendMessage(m.chat, {
      text: "⚠️ Unicode Bug Detected and Blocked!",
      quoted: m
    });
  }

  return await next();
});
