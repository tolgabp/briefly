const jwt = require('jsonwebtoken');
const { User } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.is_verified) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
