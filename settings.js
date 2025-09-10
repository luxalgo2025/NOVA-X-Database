const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {

SESSION_ID: process.env.SESSION_ID || 'KSMD~qp5Q2YCK#yvDSU4wuzbXC616jMVFd29H4XJwVStlPN4e7-UQYWW0',
PREFIX: process.env.PREFIX || '.',
FOOTER: process.env.FOOTER || '> *©卩ᴏᴡᴇʀᴇᴅ ʙʏ ɴᴏᴠᴀ-x ᴍᴅ 👾*',
BOT_NAME: process.env.BOT_NAME || '𝐍ｏ𝐕𝐀-ｘ Ｍ𝐃',
MODE: process.env.MODE === undefined ?"groups" : process.env.MODE,
BUTTON: process.env.BUTTON || 'true',
AUTO_REPLY: process.env.AUTO_REPLY || 'true',
AUTO_VOICE: process.env.AUTO_VOICE || 'true',    
AUTO_BIO: process.env.AUTO_BIO || 'true',
OWNER_NAME: process.env.OWNER_NAME || '_Mr Unknown X Luxalgo_',
OWNER_NUMBER: process.env.OWNER_NUMBER || '94723975388',
AUTO_READ_STATUS: process.env.AUTO_READ_STATUS === undefined ?"true" : process.env.AUTO_READ_STATUS
};
