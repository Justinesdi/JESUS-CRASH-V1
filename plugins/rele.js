const { cmd } = require('../command');

cmd({
  pattern: "rele",
  desc: "Tag tout manm group la an mas",
  category: "spam",
  react: "🗣️",
  filename: __filename,
  groupParticipants: true // OBLIGATWA pou w ka gen aksè ak `participants`
}, async (conn, m, { participants, isGroup, reply }) => {
  if (!isGroup) return await reply("❌ *Kòmand sa disponib sèlman nan group!*");

  try {
    const mentions = participants.map(p => p.id).filter(Boolean);
    if (mentions.length === 0) return await reply("❌ Pa gen manm pou tag.");

    const mentionText = `
╭────〔 *🔊 MWEN RELE NOU UI GYET MANMAN NOU* 〕─────⬣
│ 👑 *Admin ap rele nou tout!* 
│
${mentions.map((id, i) => `│ ${i + 1}. @${id.split('@')[0]}`).join('\n')}
│
╰───────────────────────────────────────────────────⬣
*⚠️ Pa inyore apèl sa bann chen😭😂!*
`.trim();

    await conn.sendMessage(m.chat, {
      text: mentionText,
      mentions: mentions,
      quoted: m
    });

  } catch (err) {
    console.error("Error in .rele command:", err);
    await reply("❌ Erè pandan tag tout moun.");
  }
});
