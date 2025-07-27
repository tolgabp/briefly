const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const checkQuota = require('../middleware/checkQuota');
const { summarize, getHistory } = require('../controllers/summarizeController');

router.post('/', authenticate, checkQuota, summarize); // ✅ only this version
router.get('/history', authenticate, getHistory);

module.exports = router;