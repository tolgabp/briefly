const axios = require("axios");
const logger = require("../utils/logger");

exports.generateSummary = async (text, tone = '', length = '') => {
  const prompt = `Summarize this content in 2–4 sentences${tone ? ` with a ${tone} tone` : ''}${length ? ` and make it ${length}` : ''}:\n\n${text}`;

  try {
    logger.info("🔁 Sending summary request to Groq");

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const summary = response?.data?.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      logger.warn("⚠️ LLM response missing summary content");
      throw new Error("AI returned an empty summary.");
    }

    logger.info("✅ Summary generated successfully");
    return summary;

  } catch (err) {
    if (err.code === "ECONNABORTED") {
      logger.error("❌ Groq request timed out after 15s");
      throw new Error("AI response timed out. Please try again.");
    }

    logger.error(`❌ Groq API Error: ${err.message}`);
    throw new Error("Failed to generate summary from AI.");
  }
};