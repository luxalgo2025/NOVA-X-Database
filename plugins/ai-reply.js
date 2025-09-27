const config = require("../settings");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getAIResponse(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (e) {
    console.error("Gemini Error:", e);
    return "😅 AI error, try again later.";
  }
}

module.exports = (conn) => {
  conn.ev.on("messages.upsert", async (chat) => {
    try {
      if (config.AI_REPLY !== "true") return; // check toggle
      const mek = chat.messages[0];
      if (!mek.message) return;

      // ignore bot’s own msgs
      if (mek.key.fromMe) return;

      const from = mek.key.remoteJid;
      const type = Object.keys(mek.message)[0];
      const userText =
        type === "conversation"
          ? mek.message.conversation
          : mek.message[type]?.caption ||
            mek.message[type]?.text ||
            mek.message.extendedTextMessage?.text;

      if (!userText) return;

      // typing indicator
      await conn.sendPresenceUpdate("composing", from);

      // get Gemini response
      const aiResponse = await getAIResponse(userText);

      // send reply
      await conn.sendMessage(from, { text: aiResponse }, { quoted: mek });
    } catch (e) {
      console.error("AI Reply Handler Error:", e);
    }
  });
};
