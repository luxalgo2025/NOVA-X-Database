// antiDelete.js
const { isJidGroup } = require("@whiskeysockets/baileys");
const config = require("../settings");

async function antiDeleteHandler(conn, mek) {
    try {
        if (!config.ANTI_DELETE) return;

        // mek is deleted message info
        const { key, message } = mek;
        if (!message) return;

        // Determine where to send the message
        let sendTo = config.ANTI_DELETE_PATH === "inbox" ? conn.user.jid : key.remoteJid;

        // Sender info
        const sender = key.participant || key.remoteJid;
        const senderName = mek.pushName || "Unknown";
        const groupName = isJidGroup(key.remoteJid) ? (await conn.groupMetadata(key.remoteJid)).subject : null;
        const time = new Date().toLocaleString("en-GB", { hour12: false });

        // Build message info text
        let infoText = `⚠️ Message Deleted\n`;
        infoText += groupName ? `Group: ${groupName}\n` : "";
        infoText += `Sender: ${senderName}\n`;
        infoText += `Time: ${time}\n`;
        if (message?.conversation) infoText += `Message: ${message.conversation}\n`;
        if (message?.extendedTextMessage?.text) infoText += `Message: ${message.extendedTextMessage.text}\n`;

        // Detect type
        const type = Object.keys(message)[0]; // e.g., "conversation", "imageMessage", etc.

        switch (type) {
            case "conversation":
            case "extendedTextMessage":
                await conn.sendMessage(sendTo, { text: infoText });
                break;

            case "imageMessage":
                await conn.sendMessage(sendTo, {
                    caption: (message.imageMessage.caption ? message.imageMessage.caption + "\n" : "") + infoText,
                    image: { url: await conn.downloadMediaMessage(mek, "buffer") }
                });
                break;

            case "videoMessage":
                await conn.sendMessage(sendTo, {
                    caption: (message.videoMessage.caption ? message.videoMessage.caption + "\n" : "") + infoText,
                    video: { url: await conn.downloadMediaMessage(mek, "buffer") }
                });
                break;

            case "audioMessage":
                await conn.sendMessage(sendTo, {
                    audio: { url: await conn.downloadMediaMessage(mek, "buffer") },
                    mimetype: "audio/mpeg",
                    ptt: false
                });
                break;

            case "voiceMessage":
                await conn.sendMessage(sendTo, {
                    audio: { url: await conn.downloadMediaMessage(mek, "buffer") },
                    mimetype: "audio/ogg",
                    ptt: true
                });
                break;

            case "stickerMessage":
                await conn.sendMessage(sendTo, {
                    sticker: { url: await conn.downloadMediaMessage(mek, "buffer") }
                });
                break;

            case "documentMessage":
                await conn.sendMessage(sendTo, {
                    document: { url: await conn.downloadMediaMessage(mek, "buffer") },
                    fileName: message.documentMessage.fileName || "file"
                });
                break;

            default:
                await conn.sendMessage(sendTo, { text: infoText + "\n(Type: " + type + ")" });
        }

    } catch (e) {
        console.log("ANTI DELETE ERROR:", e);
    }
}

module.exports = { antiDeleteHandler };
