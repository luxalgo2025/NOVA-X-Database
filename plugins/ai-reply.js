const config = require("../settings");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getAIResponse(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("Gemini Error:", e);
    return "😅 Sorry, I couldn't process that.";
  }
}

module.exports = (conn) => {
  conn.ev.on("messages.upsert", async (chat) => {
    try {
      if (!config.AI_REPLY) return; // Only if enabled
      const mek = chat.messages[0];
      if (!mek.message) return;

      const from = mek.key.remoteJid;
      const isReply = mek.message?.extendedTextMessage?.contextInfo?.stanzaId;

      // Trigger only if someone replies to bot's message
      if (isReply) {
        const botMessage = mek.message.extendedTextMessage.contextInfo.participant;
        if (botMessage && botMessage.includes(conn.user.id.split(":")[0])) {
          const userText = mek.message?.extendedTextMessage?.text || "";
          if (!userText) return;

          const aiResponse = await getAIResponse(userText);
          await conn.sendMessage(from, { text: aiResponse }, { quoted: mek });
        }
      }
    } catch (e) {
      console.error("AI Reply Error:", e);
    }
  });
};
