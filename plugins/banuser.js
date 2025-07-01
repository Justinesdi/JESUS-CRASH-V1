const fs = require('fs');
const path = require('path');
const banFile = path.join(__dirname, '../lib/banlist.json');
const chancesFile = path.join(__dirname, '../lib/chances.json');

if (!fs.existsSync(banFile)) fs.writeFileSync(banFile, JSON.stringify([]));
if (!fs.existsSync(chancesFile)) fs.writeFileSync(chancesFile, JSON.stringify({}));

let bannedUsers = JSON.parse(fs.readFileSync(banFile));
let userChances = JSON.parse(fs.readFileSync(chancesFile));

const saveBanlist = () => {
  fs.writeFileSync(banFile, JSON.stringify(bannedUsers, null, 2));
};

const saveChances = () => {
  fs.writeFileSync(chancesFile, JSON.stringify(userChances, null, 2));
};

const { cmd } = require('../command');
const config = require('../config');

// Function to format chances message in ASCII box
function formatChancesLeft(chances) {
  const line = '║                  ║';
  const chancesLine = `║   You have ${chances} chance${chances === 1 ? '' : 's'} left   ║`;
  return (
    '╔══════════════════╗\n' +
    line + '\n' +
    chancesLine + '\n' +
    line + '\n' +
    '╚══════════════════╝'
  );
}

// Ban command (you can keep yours as is)
cmd({
  pattern: 'ban',
  desc: '🚫 Ban a user from using the bot.',
  category: 'spam',
  use: '<@tag | number | reply>',
  filename: __filename,
}, async (conn, m, { args, reply }) => {
  const sender = m.sender;
  const isCreator = [...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net'), conn.decodeJid(conn.user.id)].includes(sender);
  if (!isCreator) return reply('🚫 Only the bot owner can use this command.');

  const mentioned = m.mentionedJid?.[0];
  const replied = m.quoted?.sender;
  const numberArg = args[0]?.replace(/\D/g, '');
  const target = mentioned || replied || (numberArg ? numberArg + '@s.whatsapp.net' : null);

  if (!target) return reply('❌ Tag, reply, or type a number to ban.');

  if (bannedUsers.includes(target)) {
    return reply(`⚠️ That user is already banned.`);
  }

  bannedUsers.push(target);
  saveBanlist();
  return reply(`✅ User *@${target.split('@')[0]}* has been *banned*.`, { mentions: [target] });
});

// Chance control for any command usage
cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m, { command, reply }) => {
  try {
    const sender = m.sender;

    // If banned, refuse access
    if (bannedUsers.includes(sender)) {
      return reply('🚫 Sorry, you are banned from using this bot.');
    }

    // If it's a command (starts with prefix)
    if (command) {
      if (!userChances[sender]) {
        userChances[sender] = 3; // default 3 chances
      }

      userChances[sender]--;

      if (userChances[sender] <= 0) {
        if (!bannedUsers.includes(sender)) {
          bannedUsers.push(sender);
          saveBanlist();
          saveChances();
          return reply(
            `❌ *You have used all your chances and are now banned from using the bot.*\n` +
            `Contact the owner if you want to be unbanned.`
          );
        }
      } else {
        saveChances();
        return reply(formatChancesLeft(userChances[sender]));
      }
    }
  } catch (e) {
    console.error(e);
  }
});
