const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../lib/command')
const config = require('../settings');
const {fetchJson} = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

cmd({
  pattern: "facebook2",
  react: "🎥",
  alias: ["fbb", "fbvideo2", "fb2"],
  desc: "Download videos from Facebook",
  category: "download",
  use: '.facebook <facebook_url>',
  filename: __filename
},
async(conn, mek, m, {
    from, prefix, q, reply
}) => {
  try {
    if (!q) return reply("🚩 Please give me a facebook url");

    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);
    
    if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
      return reply("I couldn't find anything :(");
    }

    let caption = `*🖥️ 𝐊ꜱᴍ𝐃 𝐅ᴀᴄᴇʙᴏᴏ𝐊 𝐃𝐋*

📝 ＴＩＴＬＥ : 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝚅𝙸𝙳𝙴𝙾
🔗 ＵＲＬ : ${q}`;

    // THUMBNAIL SEND
    if (fb.result.thumb) {
      if (config.BUTTON) {
        // BUTTON REPLY
        await conn.sendMessage(from, {
          image: { url: fb.result.thumb },
          caption : caption,
          buttons: [
            {buttonId: `fb_sd ${fb.result.sd}`, buttonText: {displayText: "📹 SD QUALITY"}, type: 1},
            {buttonId: `fb_hd ${fb.result.hd}`, buttonText: {displayText: "🎞 HD QUALITY"}, type: 1}
          ],
          headerType: 4
        }, { quoted: mek });
      } else {
        // NUMBER REPLY (LIST)
        let sections = [
          {
            title: "🎬 Choose Quality",
            rows: []
          }
        ];

        if (fb.result.sd) {
          sections[0].rows.push({
            title: "📹 SD QUALITY",
            rowId: `fb_sd ${fb.result.sd}`,
            description: "Normal Quality Video"
          });
        }

        if (fb.result.hd) {
          sections[0].rows.push({
            title: "🎞 HD QUALITY",
            rowId: `fb_hd ${fb.result.hd}`,
            description: "High Quality Video"
          });
        }

        const listMessage = {
          text: caption,
          footer: "Select the quality you want 👇",
          title: "Facebook Video Downloader",
          buttonText: "📥 Download Options",
          sections
        };

        await conn.sendMessage(from, listMessage, { quoted: mek });
      }
    }

  } catch (err) {
    console.error(err);
    reply("*ERROR*");
  }
});

// =======================
// HANDLERS FOR SD & HD
// =======================
cmd({
  pattern: "fb_sd",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, {from, args}) => {
  const url = args[0];
  if (!url) return;
  await conn.sendMessage(from, {
    video: { url },
    mimetype: "video/mp4",
    caption: "*SD QUALITY* ✅"
  }, { quoted: mek });
});

cmd({
  pattern: "fb_hd",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, {from, args}) => {
  const url = args[0];
  if (!url) return;
  await conn.sendMessage(from, {
    video: { url },
    mimetype: "video/mp4",
    caption: "*HD QUALITY* ✅"
  }, { quoted: mek });
});
