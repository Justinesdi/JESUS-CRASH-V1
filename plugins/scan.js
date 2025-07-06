const { cmd } = require('../command');
const moment = require("moment-timezone");
const config = require('../config');

cmd({
  pattern: "scan",
  category: "main",
  desc: "Show session link and instructions",
  filename: __filename
}, async (conn, m, { repondre, nomAuteurMessage, mybotpic }) => {
  moment.tz.setDefault('Etc/GMT');
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  const infoMsg = `
*Tap on the link to get session 👑 Connect with jesus:*
👉 https://sessions-jesus-crash.onrender.com/qr

*📌 STEPS TO GET SESSION:*
1. Open link
2. Enter your WhatsApp number with country code (ex: 509xxxxx)
3. JESUS will send you a code
4. Tap the WhatsApp notification and paste the code
5. Wait… JESUS will send you a session string in your inbox
6. Copy & send to your deployer or bot

💻 *Enjoy JESUS-CRASH-V1 Bot!*`;

  const menuMsg = `\n> Made by: © JESUS CRASH`;

  const lien = await mybotpic();
  if (lien?.match(/\.(mp4|gif)$/i)) {
    return await conn.sendMessage(m.chat, {
      video: { url: lien },
      caption: infoMsg + menuMsg,
      footer: "Je suis *JESUS*, développeur JESUS-CRASH-V1",
      gifPlayback: true
    }, { quoted: m });
  } else if (lien?.match(/\.(jpeg|png|jpg)$/i)) {
    return await conn.sendMessage(m.chat, {
      image: { url: lien },
      caption: infoMsg + menuMsg,
      footer: "Je suis *JESUS*, développeur JESUS-CRASH-V1"
    }, { quoted: m });
  } else {
    return repondre(infoMsg + menuMsg);
  }
});