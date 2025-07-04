const { cmd } = require('../command');
const { writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs');
const { fromBuffer } = require('file-type');
const path = require('path');

cmd({
  pattern: "toimage",
  alias: ["img", "photo"],
  category: "convert",
  desc: "Convert sticker to normal image",
  filename: __filename,
}, async (conn, m, { reply }) => {
  const quoted = m.quoted;

  if (!quoted || !quoted.message || !quoted.message.stickerMessage) {
    return await reply("❌ Please reply to a sticker to convert it into an image.");
  }

  try {
    // Kreye folder tanporè si li pa egziste
    const tempDir = path.resolve(__dirname, "../sessions/temp");
    if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });

    const buffer = await conn.downloadMediaMessage(quoted);
    const { ext } = (await fromBuffer(buffer)) || { ext: 'webp' };
    const filename = path.join(tempDir, `toimage-${Date.now()}.${ext}`);

    writeFileSync(filename, buffer);

    await conn.sendMessage(m.chat, {
      image: { url: filename },
      caption: "✅ Successfully converted sticker to image!",
    }, { quoted: m });

    // Efase fichye apre 5 segonn
    setTimeout(() => {
      try {
        unlinkSync(filename);
      } catch {}
    }, 5000);

  } catch (err) {
    console.error(err);
    await reply("❌ Error occurred during conversion.");
  }
});
