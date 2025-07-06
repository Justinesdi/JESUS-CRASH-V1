const { cmd } = require('../command');
const config = require('../config');

// Map pou sove eta antitag pou chak gwoup
const antiTagStatus = new Map();
const warningDB = new Map(); // Simple in-memory warning system

cmd({
  pattern: "antitag",
  category: "group",
  fromMe: true,
  desc: "Protect owner from being tagged in groups",
  filename: __filename,
}, async (conn, m, { repondre, arg }) => {
  const groupId = m.chat;

  try {
    if (arg.length > 0) {
      const action = arg[0].toLowerCase();

      if (action === "on") {
        antiTagStatus.set(groupId, true);
        return repondre("🛡️ *Anti-tag protection activated*");
      } else if (action === "off") {
        antiTagStatus.set(groupId, false);
        return repondre("❌ *Anti-tag protection deactivated*");
      } else if (action === "status") {
        const status = antiTagStatus.get(groupId) ? "ACTIVE ✅" : "INACTIVE ❌";
        return repondre(`🛡️ Anti-tag Status: ${status}`);
      }
    }

    return repondre(
      `🛡️ *Anti-tag Commands:*\n` +
      `• *${config.PREFIX}antitag on* - Enable protection\n` +
      `• *${config.PREFIX}antitag off* - Disable protection\n` +
      `• *${config.PREFIX}antitag status* - Check current status`
    );

  } catch (e) {
    console.error("❌ Error in antitag cmd:", e);
    return repondre("❌ Error while processing command.");
  }
});

// Handler pou blok tag sou owner
module.exports.antiTagHandler = async (m, conn) => {
  try {
    const groupId = m.key.remoteJid;
    if (!groupId || !antiTagStatus.get(groupId)) return;

    if (m?.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      const mentionedJids = m.message.extendedTextMessage.contextInfo.mentionedJid;
      const ownerJid = config.OWNER_NUMBER + "@s.whatsapp.net";

      if (mentionedJids.includes(ownerJid)) {
        await conn.sendMessage(groupId, {
          text: `*❌ DON'T TAG MY OWNER!*\n@${m.key.participant.split('@')[0]}`,
          mentions: [m.key.participant]
        });

        const warnings = warningDB.get(m.key.participant) || 0;
        warningDB.set(m.key.participant, warnings + 1);

        if (warnings + 1 >= 3) {
          await conn.groupParticipantsUpdate(
            groupId,
            [m.key.participant],
            "remove"
          );
        }
      }
    }
  } catch (e) {
    console.error("❌ Anti-tag Handler Error:", e);
  }
};
