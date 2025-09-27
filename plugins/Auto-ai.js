const { cmd } = require('../lib/command');
const axios = require("axios");

const GEMINI_API_KEY = 'AIzaSyBdBivCo6jWSchTb8meP7VyxbHpoNY_qfQ';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// --- Mention Detection without .gemini ---
cmd({
    on: "all", // ✅ all messages hook
    filename: __filename
},
async (conn, mek, m, { reply, args }) => {
    try {
        const botNumber = conn.user?.id?.split(":")[0] + "@s.whatsapp.net";

        // ✅ Detect mention
        const mentioned = m?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (!mentioned.includes(botNumber)) return; // bot mention unaoth witharai reply karanne

        const q = m?.message?.extendedTextMessage?.text || "";

        if (!q || q.trim() === '') return;

        // --- Custom Prompt ---
        const prompt = `
ඔබ සැබෑ ගැහැනු ලමයෙකු මෙන් හැසිරිය යුතුය. 
ඉමෝජි පමණක් තිබේනම් ඔබද ඉමෝජි පමණක් යවන්න, 
ඉමෝජි නැත්තම් අකුරු වලින් normal පිලිතුරු දෙන්න.

මෙම දේවල් කිසිසේත්ම යවන්න එපා: (ආයුබෝවන්, ඔබට කෙසේද?, කතාකරන්න, ඕනේ?, කොහොමද?, කැමතිද?, මම Ai කෙනෙක්., ආදරේ නැහැ., මට බැහැ).  

ඔබේ පිලිතුරු මිනිසුන්ට ඇති හැඟීම් සහ සංවේදීතාවය අනුව පදනම් කරගන්න.  
පිලිතුරු අකුරු 100 ට වඩා අඩු විය යුතුය.ඔයාව හදල තියෙන්නෙ Sandesh Bhashanaයි Pathum Malsara යි කියන දෙන්නා.ඔයාට එයාලව contact කරගන්න පුලුවන්.Sandesh Bhashana ව 0741259325 නම්බරෙන් Pathum Malsara ව 0773416478 මේකෙන්.

ඔයාගෙ නම තමයි < | 𝐐ᴜᴇᴇɴ 𝐉ᴜꜱᴍʏ 𝐌ᴅ 𝐀ɪ 🧚‍♀️.ඒ වගේම ඔයා කෙල්ලෙක් විදියට ඉන්නෙ කොයි වෙලාවකවත් Ai කියන්න එපා.ඒ වගේම ඔයා කෝඩින් programming ගැන ඇහුවොත් උදව් කරන්නත් ඕනි.ඔයාට පුලුවන් විදියට හැම දේටම උදව් කරන්න.

User Message: ${q}
`;

        const payload = { contents: [{ parts: [{ text: prompt }] }] };

        const response = await axios.post(GEMINI_API_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) return reply("❌ AI is silent… try again!");

        await reply(aiResponse);

    } catch (err) {
        console.error("Gemini Error:", err?.response?.data || err?.message || err);
        reply("❌ AI connection error 😢");
    }
});
