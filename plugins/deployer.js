const moment = require("moment-timezone");
const { cmd } = require('../command');
const config = require('../config'); // Pou OWNER_NAME, MODE, elatriye

cmd({
  pattern: "deployer",
  category: "main",
  desc: "Show bot deployer information",
  filename: __filename
}, async (conn, m, { repondre, nomAuteurMessage, mybotpic }) => {
  try {
    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    const infoMsg = `*Hello ${nomAuteurMessage || "User"}!*\n\n` +
                    `*Deployer Information:*\n` +
                    `• *Name:* ${config.OWNER_NAME}\n` +
                    `• *Date:* ${date}\n` +
                    `• *Time:* ${temps}\n\n` +
                    `> *Powered by DAWENS BOY*`;

    const mediaUrl = await mybotpic();

    if (mediaUrl && mediaUrl.match(/\.(mp4|gif)$/i)) {
      await conn.sendMessage(m.chat, {
        video: { url: mediaUrl },
        caption: infoMsg,
        gifPlayback: true,
        contextInfo: {
          externalAdReply: {
            title: `JESUS-CRASH-V1 Deployer`,
            body: "Premium WhatsApp Bot",
            thumbnailUrl: mediaUrl,
            mediaType: 2,
            mediaUrl: "https://files.catbox.moe/fuoqii.png",
            sourceUrl: "https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B"
          }
        }
      }, { quoted: m });

    } else if (mediaUrl && mediaUrl.match(/\.(jpeg|png|jpg)$/i)) {
      await conn.sendMessage(m.chat, {
        image: { url: mediaUrl },
        caption: infoMsg,
        contextInfo: {
          externalAdReply: {
            title: `JESUS-CRASH-V1 Deployer`,
            body: "Premium WhatsApp Bot",
            thumbnailUrl: mediaUrl,
            mediaType: 1,
            mediaUrl: "https://files.catbox.moe/fuoqii.png",
            sourceUrl: "https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B"
          }
        }
      }, { quoted: m });

    } else {
      await repondre(infoMsg);
    }
  } catch (e) {
    console.error("❌ Deployer Command Error:", e);
    await repondre("❌ An error occurred while processing the command.");
  }
});