const { cmd } = require('../command');

cmd({
    pattern: "soti",
    desc: "Remove a member from the group (by admin only)",
    category: "spam",
    filename: __filename
}, async (conn, mek, m, { isGroup, participants, sender, args, reply }) => {
    try {
        if (!isGroup) return await reply("📍 Only available in groups!");

        const groupAdmins = participants
          .filter(p => p.admin)
          .map(p => (p.id.includes('@s.whatsapp.net') ? p.id : `${p.id}@s.whatsapp.net`));
          
        const senderJid = sender.includes('@s.whatsapp.net') ? sender : `${sender}@s.whatsapp.net`;

        if (!groupAdmins.includes(senderJid)) 
            return await reply("❌ You are not an admin in this group!");

        let target;
        if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } else if (args[0]) {
            const numOnly = args[0].replace(/[^0-9]/g, '');
            target = `${numOnly}@s.whatsapp.net`;
        } else {
            return await reply("❗ Please reply to a message or provide the member's number.");
        }

        if (target === senderJid) 
            return await reply("❌ You cannot remove yourself!");

        if (typeof conn.groupParticipantsUpdate !== 'function') 
            return await reply("⚠️ Remove option is not supported on this connection.");

        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        await reply("✅ Member removed successfully!");

    } catch (e) {
        console.error('Soti command error:', e);
        await reply("⚠️ Error during the operation.");
    }
});
