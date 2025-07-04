const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'take ?(.*)',
  desc: 'Pran sticker/img/video epi mete pack & author ou vle',
  category: 'convert',
  react: '📦',
  filename: __filename
}, async (bot, mek, m, { args, reply }) => {
  try {
    if (args.length < 2) return reply('❌ Egzanp: .take dawens Je suis le roi');

    const pack = args[0]; // Premye mo = pack
    const author = args.slice(1).join(' '); // Rès = author

    const quoted = mek.quoted;
    if (!quoted) return reply('❌ Reponn ak yon *sticker*, *imaj*, oswa *videyo ≤ 20s*.');

    let qmsg = quoted.message;
    let actualMsg = quoted;

    // Sipò view-once
    if (qmsg?.viewOnceMessage) {
      const inner = qmsg.viewOnceMessage.message;
      const mediaType = Object.keys(inner)[0];
      quoted.mtype = mediaType;
      actualMsg = { ...quoted, message: inner };
    }

    if (!['stickerMessage', 'videoMessage', 'imageMessage'].includes(quoted.mtype)) {
      return reply('❌ Sipòte sèlman *sticker*, *imaj*, oswa *videyo ≤ 20s*.');
    }

    if (quoted.mtype === 'videoMessage' && actualMsg.message.videoMessage.seconds > 20) {
      return reply('❌ Videyo a depase 20 segonn.');
    }

    const media = await bot.downloadMediaMessage(actualMsg);
    if (!media) return reply('❌ Pa ka telechaje medya.');

    const sticker = new Sticker(media, {
      pack,
      author,
      type: StickerTypes.FULL,
      quality: 100,
      fps: 10,
    });

    const buffer = await sticker.toBuffer();
    await bot.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });

  } catch (err) {
    console.error('[TAKE ERROR]', err);
    reply('❌ Erè pandan tretman. Medya a ka pa disponib.');
  }
});
