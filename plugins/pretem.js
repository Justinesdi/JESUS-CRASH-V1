const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'pretem',
  desc: 'Re-send any sticker, image, or short video as yours (supports view-once)',
  category: 'spam',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const quoted = mek.quoted;

    if (!quoted) return reply('❌ Reponn ak yon *sticker*, *imaj*, oswa *videyo ≤ 20s*.');

    // Dekode mesaj view-once si genyen
    let qmsg = quoted.message;
    if (qmsg?.viewOnceMessage?.message?.imageMessage) {
      qmsg = qmsg.viewOnceMessage.message;
      quoted.mtype = 'imageMessage'; // override type
    }

    // Si mtype pa sipòte
    if (!['stickerMessage', 'videoMessage', 'imageMessage'].includes(quoted.mtype)) {
      return reply('❌ Reponn ak yon *sticker*, *imaj*, oswa *videyo* ki pa depase 20 segonn.');
    }

    // Pou videyo: tcheke dire
    if (quoted.mtype === 'videoMessage' && qmsg.videoMessage.seconds > 20) {
      return reply('❌ Videyo a two long (> 20s).');
    }

    const media = await bot.downloadMediaMessage({ message: qmsg });
    if (!media) return reply('❌ Echèk download medya.');

    const userName = mek.pushName || 'Unknown';
    const sticker = new Sticker(media, {
      pack: userName,
      author: 'Ma volonté est un feu indomptable,\nmon nom, une légende.',
      type: StickerTypes.FULL,
      quality: 100,
      fps: 10,
      loop: 0,
    });

    const buffer = await sticker.toBuffer();
    await bot.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });

  } catch (err) {
    console.error('[PRETEM ERROR]', err);
    reply('❌ Erè pandan konvèsyon. Asire w ke mesaj la disponib.');
  }
});
