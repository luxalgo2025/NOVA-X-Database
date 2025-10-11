const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../settings');

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || 'Unknown content';
    deleteInfo += `\n◈ 𝙲𝙾𝙽𝚃𝙴𝙽𝚃 ━ ${messageContent}`;

    await conn.sendMessage(
        jid,
        {
            text: deleteInfo,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek },
    );
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null && update.update.messageStubType === 1) {
            try {
                const store = await conn.loadMessage(update.key.remoteJid, update.key.id);

                if (!store || !store.message) continue; // message නෑ නම් skip
                const mek = store;
                const isGroup = isJidGroup(update.key.remoteJid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(update.key.remoteJid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `*╭────⬡ < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐀ɴᴛɪ 𝐃ᴇʟᴇᴛᴇ ❤‍🔥 ⬡────*
*├♻️ 𝚂𝙴𝙽𝙳𝙴𝚁:* @${sender}
*├👥 𝙶𝚁𝙾𝚄𝙿:* ${groupName}
*├⏰ 𝚃𝙸𝙼𝙴:* ${deleteTime}
*├🗑️ 𝙳𝙴𝙻𝙴𝚃𝙴𝙳 𝙱𝚈:* @${deleter}
*╰💬 𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* Content Below 🔽`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    
                    deleteInfo = `*╭────⬡ 🤖 < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐀ɴᴛɪ 𝐃ᴇʟᴇᴛᴇ ⬡────*
*├👤 𝚂𝙴𝙽𝙳𝙴𝚁:* @${senderNumber}
*├⏰ 𝚃𝙸𝙼𝙴:* ${deleteTime}
*╰💬 𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* Content Below 🔽`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            } catch (e) {
                console.log("AntiDelete Error:", e);

            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
