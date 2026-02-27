const express = require('express');
const { db } = require('../database');
const router = express.Router();

// 获取所有监控项
router.get('/monitors', (req, res) => {
  const monitors = db.prepare('SELECT * FROM monitors ORDER BY id DESC').all();
  res.json(monitors);
});

// 创建监控项
router.post('/monitors', (req, res) => {
  const { name, type, target, interval, timeout, threshold_http_code, threshold_response_time } = req.body;
  const stmt = db.prepare(
    `INSERT INTO monitors (name, type, target, interval, timeout, threshold_http_code, threshold_response_time)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const info = stmt.run(name, type, target, interval || 60, timeout || 10, threshold_http_code, threshold_response_time);
  res.json({ id: info.lastInsertRowid });
});

// 更新监控项
router.put('/monitors/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, target, interval, timeout, threshold_http_code, threshold_response_time, enabled } = req.body;
  const stmt = db.prepare(
    `UPDATE monitors SET name=?, type=?, target=?, interval=?, timeout=?, threshold_http_code=?, threshold_response_time=?, enabled=?
     WHERE id=?`
  );
  stmt.run(name, type, target, interval, timeout, threshold_http_code, threshold_response_time, enabled ? 1 : 0, id);
  res.json({ success: true });
});

// 删除监控项
router.delete('/monitors/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM monitors WHERE id=?').run(id);
  res.json({ success: true });
});

// 获取监控项历史记录
router.get('/monitors/:id/history', (req, res) => {
  const { id } = req.params;
  const limit = parseInt(req.query.limit) || 100;
  const history = db.prepare(
    `SELECT * FROM heartbeats WHERE monitor_id = ? ORDER BY id DESC LIMIT ?`
  ).all(id, limit);
  res.json(history);
});

// 获取公开状态数据（所有监控项最新状态 + 24小时可用性）
router.get('/status', (req, res) => {
  const monitors = db.prepare('SELECT * FROM monitors ORDER BY id').all();
  const result = monitors.map(m => {
    // 获取最新一条记录
    const last = db.prepare(
      `SELECT status, response_time, response_code, error, created_at
       FROM heartbeats WHERE monitor_id = ? ORDER BY id DESC LIMIT 1`
    ).get(m.id);
    // 计算24小时可用性
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const stats = db.prepare(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status='up' THEN 1 ELSE 0 END) as up
       FROM heartbeats WHERE monitor_id = ? AND created_at >= ?`
    ).get(m.id, dayAgo);
    const uptime = stats.total > 0 ? (stats.up / stats.total * 100).toFixed(2) : 100;
    return {
      id: m.id,
      name: m.name,
      type: m.type,
      target: m.target,
      last: last || { status: 'unknown' },
      uptime: uptime
    };
  });
  res.json(result);
});

module.exports = router;
