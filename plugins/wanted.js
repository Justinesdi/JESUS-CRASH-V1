const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

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

cmd({
  pattern: 'wanted',
  alias: ['wantedposter'],
  desc: "Generate a Wanted poster from replied image or profile picture",
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
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        imageBuffer = Buffer.from(response.data, 'binary');
      } catch {
        return reply('❌ Pa gen foto reponn e pa ka jwenn foto profil ou.');
      }
    }

    // Upload image to telegraph to get a public URL
    const uploadedUrl = await uploadToTelegraph(imageBuffer);

    // Call nekobot API with public URL
    const { data } = await axios.get(`https://nekobot.xyz/api/imagegen`, {
      params: {
        type: 'wanted',
        image: uploadedUrl
      }
    });

    if (!data.success) return reply('❌ Echèk pou kreye afich la.');

    const wantedRes = await axios.get(data.message, { responseType: 'arraybuffer' });
    const wantedImage = Buffer.from(wantedRes.data, 'binary');

    await conn.sendMessage(from, { image: wantedImage, caption: '*🪧 Afich WANTED ou!*' }, { quoted: mek });

  } catch (e) {
    console.error('Wanted Error:', e);
    reply('❌ Erè pandan afich la ap fèt.');
  }
});
