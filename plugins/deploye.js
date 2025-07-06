const util = require('util');
const fs = require('fs-extra');
const os = require("os");
const moment = require("moment-timezone");
const { cmd } = require('../command');
const config = require('../config');
const { format } = require('../lib/functions');
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

cmd({
  pattern: "deploy",
  category: "main",
  desc: "Instructions pou deplwaye JESUS-CRASH-V1",
  filename: __filename
}, async (conn, m, { repondre, nomAuteurMessage, mybotpic }) => {
  
  var mode = config.MODE?.toLowerCase() === "yes" ? "public" : "private";

  moment.tz.setDefault('Etc/GMT');
  const temps = moment().format('HH:mm:ss');
  const date = moment().format('DD/MM/YYYY');

  let infoMsg = `
Hello ${nomAuteurMessage},,
*DEPLOYMENT STEPS* 
╭───────────────────☆
★When you want to deploy any WhatsApp bot check its repo and deployment guide.

✔ First type the *sc*, *repo* or *script* command to get JESUS CRASH V1 repository.
✔ From there you will need your *Session ID*. Here's how:

✞ Open 👉 https://sessions-jesus.onrender.com and tap *Pair Code*
✞ Enter your WhatsApp number (e.g. 50942241547)
✞ You’ll receive a login code from *Raheem*
✞ Paste it into WhatsApp
✞ dawens will DM you your *Session ID*

𝐇𝐎𝐖 𝐓𝐎 𝐃𝐄𝐏𝐋𝐎𝐘 JESUS-CRASH-V1
✔ Go to the GitHub repository and ⭐ star it first!
✔ Tap *Heroku Deploy*
✔ Enter:
   - Your Heroku API Key
   - App name (repeat it as needed)
✔ Press *Deploy*

⚠️ On some apps build logs won’t show, but deployment still works.

💬 Give credit: https://wa.me/13058962443 
╰────────────────────☆
`;

  let menuMsg = `\n     𝐑𝐞𝐠𝐚𝐫𝐝𝐬 dev dawens`;
  let lien = mybotpic();

  if (lien.match(/\.(mp4|gif)$/i)) {
    try {
      await conn.sendMessage(m.chat, {
        video: { url: lien },
        caption: infoMsg + menuMsg,
        footer: "Je suis *DAWENS*, développeur JESUS CRASH V1",
        gifPlayback: true
      }, { quoted: m });
    } catch (e) {
      console.log("🥵 Menu video error:", e);
      return repondre("🥵 🥵🥵 Menu erreur.");
    }

  } else if (lien.match(/\.(jpeg|jpg|png)$/i)) {
    try {
      await conn.sendMessage(m.chat, {
        image: { url: lien },
        caption: infoMsg + menuMsg,
        footer: "Je suis *DAWEND*, développeur JESUS CRASH V1"
      }, { quoted: m });
    } catch (e) {
      console.log("🥵 Menu image error:", e);
      return repondre("🥵 🥵🥵 Menu erreur.");
    }

  } else {
    return repondre(infoMsg + menuMsg);
  }
});