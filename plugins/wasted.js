const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

const effects = {
  wasted: 'wasted',
  triggered: 'triggered',
  rip: 'rip',
  jail: 'jail',
  blur: 'blur'
};

async function uploadToTelegraph(buffer) {
  const form = new FormData();
  form.append('file', buffer, { filename: 'image.jpg' });
  const res = await axios.post('https://telegra.ph/upload', form, {
    headers: form.getHeaders(),
  });
  if (res.data && res.data[0] && res.data[0].src) {
    return 'https://telegra.ph' + res.data[0].src;
  }
  throw new Error('Upload failed');
}

for (const [cmdName, effectType] of Object.entries(effects)) {
  cmd({
    pattern: cmdName,
    desc: `Generate ${cmdName.toUpperCase()} effect from replied photo or profile picture`,
    category: 'fun',
    filename: __filename,
  }, async (conn, mek, m, { from, reply }) => {
    try {
      let imageBuffer;

      if (m.quoted && m.quoted.message?.imageMessage) {
        imageBuffer = await conn.downloadMediaMessage(m.quoted);
      } else {
        try {
          const imageUrl = await conn.profilePictureUrl(m.sender, 'image');
          const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          imageBuffer = Buffer.from(res.data, 'binary');
        } catch {
          return reply('❌ Pa jwenn foto reponn ni profil ou.');
        }
      }

      const uploadedUrl = await uploadToTelegraph(imageBuffer);

      const { data } = await axios.get('https://nekobot.xyz/api/imagegen', {
        params: {
          type: effectType,
          image: uploadedUrl
        }
      });

      if (!data.success) return reply(`❌ Pa ka kreye imaj ${cmdName.toUpperCase()}.`);

      const effectImage = await axios.get(data.message, { responseType: 'arraybuffer' });
      const effectBuffer = Buffer.from(effectImage.data, 'binary');

      await conn.sendMessage(from, { image: effectBuffer, caption: `*${cmdName.toUpperCase()} Effect!*` }, { quoted: mek });

    } catch (e) {
      console.error(`${cmdName} Error:`, e);
      reply(`❌ Erè pandan ap kreye imaj ${cmdName.toUpperCase()}.`);
    }
  });
}
