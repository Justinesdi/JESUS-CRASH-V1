const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'take',  // pran tout sa ki apre "take" kòm paramèt
  desc: 'Re-send any sticker, image, or short video as yours (max 20s video)',
  category: 'spam',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply, match }) => {  // ajoute "match" pou jwenn paramèt
  try {
    const quoted = mek.quoted;

    if (!quoted || !['stickerMessage', 'videoMessage', 'imageMessage'].includes(quoted.mtype)) {
      return reply('❌ Reply to a *sticker*, *image*, or *short video* (max 20s).');
    }

    // Verify video duration
    if (quoted.mtype === 'videoMessage' && quoted.message.videoMessage.seconds > 20) {
      return reply('❌ Video is longer than 20 seconds. Please use a shorter one.');
    }

    const media = await bot.downloadMediaMessage(quoted);
    if (!media) return reply('❌ Failed to download media.');

    const userName = mek.pushName || 'Unknown';
    const packname = userName;

    // Text author se sa itilizatè mete apre .take, sinon default
    const authorText = match && match.trim().length > 0
      ? match.trim()
      : `Ma volonté est un feu indomptable,\nmon nom, une légende qui s’écrit à chaque pas.`;

    const sticker = new Sticker(media, {
      pack: packname,
      author: authorText,
      type: StickerTypes.FULL,
      quality: 100,
      fps: 10,
      loop: 0,
    });

    const stickerBuffer = await sticker.toBuffer();
    await bot.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

  } catch (err) {
    console.error('[TAKE ERROR]', err);
    reply('❌ Erè pandan konvèsyon. Tanpri eseye ankò.');
  }
});
