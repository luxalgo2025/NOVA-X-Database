const config = require('../settings')
const { cmd } = require('../lib/command')
const getFBInfo = require("@xaviabot/fb-downloader");
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions')

cmd({
  pattern: "fb",
  alias: ["fbdl"],
  desc: "Download Facebook videos",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "> *❌ Please provide a valid Facebook URL.*" }, { quoted: mek });
    }

    await conn.sendMessage(from, { react: { text: "📥", key: mek.key } });

    const result = await getFBInfo(q);

    const captionHeader = `
*< | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ  𝐅ʙ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ 🎥*

🔗 *𝚄𝚁𝙻*: ${q} 

*⬇️ 𝐒ᴇʟᴇᴄᴛ 𝐀ɴ 𝐎ᴘᴛɪᴏɴ 𝐁ᴇʟᴏᴡ:*
`;

    const buttons = [
      {
        buttonId: `.fbdl sd ${q}`,
        buttonText: { displayText: "📥 𝚂𝙳 𝚀𝚄𝙰𝙻𝙸𝚃𝚈" },
        type: 1
      },
      {
        buttonId: `.fbdl hd ${q}`,
        buttonText: { displayText: "🎥 𝙷𝙳 𝚀𝚄𝙰𝙻𝙸𝚃𝚈" },
        type: 1
      },
      {
        buttonId: `.fbdl audio ${q}`,
        buttonText: { displayText: "🎶 𝙰𝚄𝙳𝙸𝙾 𝙵𝙸𝙻𝙴" },
        type: 1
      }
    ]

    await conn.sendMessage(from, {
      image: { url: result.thumbnail },
      caption: captionHeader,
      footer: config.FOOTER,
      buttons,
      headerType: 4
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
})

// ================== Handle .fbdl ==================
cmd({
  pattern: "fbdl",
  desc: "Download from selected format",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { args, from, reply }) => {
  try {
    const type = args[0];
    const url = args[1];
    if (!url) return reply("> *❌ Please provide a valid Facebook URL.*");

    const result = await getFBInfo(url);

    if (type === "sd") {
      await conn.sendMessage(from, { video: { url: result.sd }, caption: `${config.FOOTER}` }, { quoted: mek });
    } else if (type === "hd") {
      await conn.sendMessage(from, { video: { url: result.hd }, caption: `${config.FOOTER}` }, { quoted: mek });
    } else if (type === "audio") {
      await conn.sendMessage(from, { audio: { url: result.sd }, mimetype: "audio/mpeg" }, { quoted: mek });
    } else {
      reply("❌ Unknown format!");
    }
  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
})
