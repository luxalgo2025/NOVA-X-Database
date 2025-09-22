const { cmd } = require("../lib/command");

cmd({
  pattern: "owner",
  react: "📇",
  desc: "Send owner contacts as vCards + detailed info message separately for each contact",
  category: "general",
  filename: __filename,
}, async (conn, mek, m) => {
  try {
    const contacts = [
      {
        name: "𝙼𝚁.𝚂𝙰𝙽𝙳𝙴𝚂𝙷 𝙱𝙷𝙰𝚂𝙷𝙰𝙽𝙰",
        number: "94741259325",
        info: `
*𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍*

👤 *Name:* Sandesh Bhashana
📱 *Number:* +94 74 741 6478
🌐 *Website:* https://sandesh-md.example
💼 *Role:* Bot Developer & Owner
✉️ *Email:* sandesh@example.com
📍 *Location:* Sri Lanka
📌 *Additional Info:* Always online, managing the bot and its plugins.

> *NOVA-X MD BOT*
`
      },
      {
        name: "𝙼𝚁.𝙿𝙰𝚃𝙷𝚄𝙼 𝙼𝙰𝙻𝚂𝙰𝚁𝙰",
        number: "94723975388",
        info: `
*𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍*

👤 *Name:* Pathum Malsara
📱 *Number:* +94 72 397 5388
🌐 *Website:* https://pathum-md.example
💼 *Role:* Co-Owner & Developer
✉️ *Email:* pathum@example.com
📍 *Location:* Sri Lanka
📌 *Additional Info:* Oversees bot updates and development.

> *NOVA-X MD BOT*
`
      }
    ];

    for (let contact of contacts) {
      // Send vCard
      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:NOVA-X MD;
TEL;type=CELL;type=VOICE;waid=${contact.number}:${contact.number}
END:VCARD`;

      await conn.sendMessage(
        m.chat,
        {
          contacts: {
            displayName: contact.name,
            contacts: [{ vcard }],
          },
        },
        { quoted: mek }
      );

      await new Promise(resolve => setTimeout(resolve, 500)); // avoid rate limits

      // Send detailed info as separate reply
      await conn.sendMessage(m.chat, { text: contact.info }, { quoted: mek });

      await new Promise(resolve => setTimeout(resolve, 500));
    }

  } catch (err) {
    console.log(err);
    m.reply("❌ Error sending owner information!");
  }
});
