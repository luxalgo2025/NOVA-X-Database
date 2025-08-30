const { cmd } = require("../lib/command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");
const { exec } = require("child_process");

// Owner JIDs
const owners = [
  "94741259325@s.whatsapp.net",
  "94723975388@s.whatsapp.net",
  "94761068032@s.whatsapp.net"
];

cmd({
  pattern: "update",
  desc: "Download latest repo zip and update bot (skip config files)",
  category: "owner",
  filename: __filename
}, async (conn, m, { reply }) => {
  try {
    const sender = m.sender; // ✅ get sender jid

    // Owner check
    if (!owners.includes(sender)) {
      return reply("⛔ This command is only for the owner!");
    }

    // Owner verified
    reply(`✅ Owner verified...!\nYou can update the bot: ${sender}`);

    const repoOwner = "luxalgo2025"; 
    const repoName = "NOVA-X-Database";        
    const zipUrl = `https://github.com/${repoOwner}/${repoName}/archive/refs/heads/main.zip`;

    reply("*𝐃ᴏᴡɴʟᴏᴀᴅɪɴɢ 𝐋ᴀᴛᴇꜱᴛ 𝐔ᴘᴅᴀᴛᴇ...⏳*");

    const zipPath = path.join(__dirname, "update.zip");
    const writer = fs.createWriteStream(zipPath);
    const response = await axios({ url: zipUrl, method: "GET", responseType: "stream" });

    response.data.pipe(writer);

    writer.on("finish", async () => {
      reply("*𝐄xᴛʀᴀᴄᴛɪɴɢ 𝐔ᴘᴅᴀᴛᴇ...📦*");

      const skipFiles = ["index.js", "config.js", "settings.js"];

      await fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .on("entry", entry => {
          let entryName = entry.path.replace(`${repoName}-main/`, "");
          if (!entryName || skipFiles.includes(entryName)) {
            console.log(`⏭️ Skipped: ${entryName}`);
            entry.autodrain();
            return;
          }

          const filePath = path.join(__dirname, "..", entryName);
          if (entry.type === "Directory") {
            fs.mkdirSync(filePath, { recursive: true });
            entry.autodrain();
          } else {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            entry.pipe(fs.createWriteStream(filePath));
          }
        })
        .promise();

      fs.unlinkSync(zipPath);

      reply("*✅ 𝚄𝙿𝙳𝙰𝚃𝙴 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴𝙳...! 🔁 Ｒᴇꜱᴛᴀʀᴛɪɴɢ Ｎᴏᴠᴀ-Ｘ ＭＤ...*");
      exec("pm2 restart all", (err) => {
        if (err) reply(`Update done ✅, but restart failed ❌:\n${err}`);
      });
    });

  } catch (err) {
    reply("❌ Update failed:\n" + err.message);
  }
});
