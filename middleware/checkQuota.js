const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const user = req.user;
    const maxDaily = 20;

    const now = new Date();
    const lastReset = user.daily_reset_at ? new Date(user.daily_reset_at).getTime() : 0;
    const diffInHours = (now.getTime() - lastReset) / (1000 * 60 * 60);

    // ✅ Reset if it's been over 24 hours
    if (diffInHours >= 24) {
      console.log(`[QUOTA] Resetting usage for user ${user.email} (Last reset: ${user.daily_reset_at})`);
      user.daily_usage_count = 0;
      user.daily_reset_at = now;
    }

    if (user.daily_usage_count >= maxDaily) {
      return res.status(429).json({ error: 'Daily quota reached. Try again after 24 hours.' });
    }

    user.daily_usage_count += 1;
    await user.save();

    console.log(`[QUOTA] User ${user.email} has used ${user.daily_usage_count}/20 summaries`);
    next();
  } catch (err) {
    console.error('[Quota Error]', err.message);
    res.status(500).json({ error: 'Quota check failed' });
  }
};