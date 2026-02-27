const express = require('express');
const path = require('path');
const router = express.Router();

// 提供公开状态页面（静态HTML）
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/status.html'));
});

module.exports = router;
