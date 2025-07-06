const { cmd } = require('../command');
const { writeFileSync, unlinkSync, existsSync, mkdirSync } = require('fs');
const { fromBuffer } = require('file-type');
const path = require('path');

cmd({
  pattern: "toimage",
  alias: ["img", "photo"],
  category: "tools",
  desc: "Convertir un sticker en image",
  filename: __filename,
}, async (conn, m, { reply }) => {
  const quoted = m.quoted;

  // ✔️ Deteksyon fleksib pou sticker
  if (
    !quoted ||
    !quoted.message ||
    (!quoted.message.stickerMessage && !quoted.mtype?.includes("sticker"))
  ) {
    return await reply("❌ *Veuillez répondre à un sticker pour le convertir en image.*");
  }

  try {
    // 📁 Kreye folder tanporè si li pa egziste
    const tempDir = path.resolve(__dirname, "../sessions/temp");
    if (!existsSync(tempDir)) mkdirSync(tempDir, { recursive: true });

    const buffer = await conn.downloadMediaMessage(quoted);

    if (!buffer) {
      return await reply("⚠️ Impossible de télécharger le sticker.");
    }

    const { ext } = (await fromBuffer(buffer)) || { ext: 'webp' };
    const filename = path.join(tempDir, `toimage-${Date.now()}.${ext}`);

    writeFileSync(filename, buffer);

    await conn.sendMessage(m.chat, {
      image: { url: filename },
      caption: "✅ *Sticker converti en image avec succès !*",
    }, { quoted: m });

    // 🧹 Efase fichye apre 5 segonn
    setTimeout(() => {
      try {
        if (existsSync(filename)) unlinkSync(filename);
      } catch (e) {}
    }, 5000);

  } catch (err) {
    console.error("❌ Erè nan konvèsyon sticker:", err);
    await reply("❌ Une erreur est survenue lors de la conversion.");
  }
});
