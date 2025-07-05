const config = require("../config");
const { cmd } = require('../command');
const { getAnti, setAnti, initializeAntiStickerSettings } = require('../data/antisticker');

initializeAntiStickerSettings();

cmd({
    pattern: "antisticker",
    alias: ['antistick', 'antis'],
    desc: "Configure Anti-Sticker system",
    category: "group",
    filename: __filename
},
async (client, message, m, { reply, q, isOwner }) => {
    if (!isOwner) {
        return await client.sendMessage(message.from, {
            text: "*📛 This is an owner command.*"
        }, { quoted: message });
    }

    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', true);
                return reply('_AntiSticker activated in groups._');

            case 'off':
                await setAnti('gc', false);
                return reply('_AntiSticker deactivated in groups._');

            case 'toggle':
                const currentStatus = await getAnti('gc');
                await setAnti('gc', !currentStatus);
                return reply(`_AntiSticker now ${!currentStatus ? 'activated' : 'deactivated'}._`);

            case 'status':
                const status = await getAnti('gc');
                return reply(`_AntiSticker status:_ ${status ? '✅ Activated' : '❌ Deactivated'}`);

            default:
                return reply(`-- *AntiSticker Command Guide* --
• \`\`.antisticker on\`\` – Activate in group
• \`\`.antisticker off\`\` – Deactivate in group
• \`\`.antisticker toggle\`\` – Toggle on/off
• \`\`.antisticker status\`\` – Check status`);
        }
    } catch (err) {
        console.error("AntiSticker Error:", err);
        return reply("An error occurred.");
    }
});
