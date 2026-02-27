const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/monitor.db');
const db = new Database(dbPath);

// 初始化表结构
function init() {
  // 监控项表
  db.exec(`
    CREATE TABLE IF NOT EXISTS monitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('http','tcp','ping','dns')) NOT NULL,
      target TEXT NOT NULL,
      interval INTEGER DEFAULT 60,
      timeout INTEGER DEFAULT 10,
      threshold_http_code TEXT,
      threshold_response_time INTEGER,
      enabled INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 心跳记录表
  db.exec(`
    CREATE TABLE IF NOT EXISTS heartbeats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      monitor_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('up','down')) NOT NULL,
      response_time INTEGER,
      response_code INTEGER,
      error TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
    );
  `);

  // 索引优化查询
  db.exec('CREATE INDEX IF NOT EXISTS idx_heartbeats_monitor_id ON heartbeats(monitor_id);');
  db.exec('CREATE INDEX IF NOT EXISTS idx_heartbeats_created_at ON heartbeats(created_at);');
}

// 导出数据库实例和初始化函数
module.exports = {
  db,
  init
};
