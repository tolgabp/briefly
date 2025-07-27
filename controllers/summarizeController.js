const { generateSummary } = require('../services/llmService');
const { Summary } = require('../models');

exports.summarize = async (req, res) => {
  try {
    const { text, tone, length } = req.body;
    if (!text || text.length < 200) {
      return res.status(400).json({ error: 'Text must be at least 200 characters.' });
    }

    const summaryText = await generateSummary(text, tone, length);

    const originalCount = text.trim().split(/\s+/).length;
    const summaryCount = summaryText.trim().split(/\s+/).length;

    const saved = await Summary.create({
      user_id: req.user.id,
      original_text: text,
      summary_text: summaryText,
      tone,
      length,
      original_word_count: originalCount,
      summary_word_count: summaryCount
    });

    res.status(200).json({
      original: text,
      summary: summaryText,
      original_word_count: originalCount,
      summary_word_count: summaryCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while summarizing.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const summaries = await Summary.findAndCountAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      total: summaries.count,
      page,
      limit,
      data: summaries.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary history.' });
  }
};