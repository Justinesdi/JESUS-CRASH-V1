const { cmd } = require('../command');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

cmd({
  pattern: "pairspam <number> <amount>",
  desc: "🔁 Spam 1000 Pair Code ak delay",
  category: "bug",
  filename: __filename
}, async (conn, m, { args, reply }) => {
  const target = args[0];
  if (!target) return reply("⚠️ Mete nimewo a: .pairspam 50912345678");

  const jid = target.includes('@s.whatsapp.net') ? target : `${target}@s.whatsapp.net`;

  try {
    for (let i = 0; i < 1000; i++) {
      const pairText = `*🧿 WhatsApp Link Pairing Code:* \n\n\`\`\`${Math.floor(Math.random()*999999)}-${Math.floor(Math.random()*999999)}\`\`\``;

      await conn.sendMessage(jid, {
        text: pairText,
        mentions: [jid],
      });

      await delay(200);
    }
    reply(`✅ 1000 Pair Code spam fini voye bay ${target}`);
  } catch (e) {
    reply(`❌ Erè pandan voye spam: ${e.message}`);
  }
});
