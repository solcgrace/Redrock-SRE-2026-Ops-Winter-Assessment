const cron = require('node-cron');
const { db } = require('../database');
const httpMonitor = require('./http');
const tcpMonitor = require('./tcp');
const pingMonitor = require('./ping');
const dnsMonitor = require('./dns');
const notifier = require('../notifier');

const monitors = {
  http: httpMonitor,
  tcp: tcpMonitor,
  ping: pingMonitor,
  dns: dnsMonitor,
};

// 记录每个监控项上次执行时间（内存中）
const lastRun = new Map();

// 执行单个监控项
async function runMonitor(monitor) {
  const now = Date.now();
  const last = lastRun.get(monitor.id) || 0;
  const intervalMs = monitor.interval * 1000;
  if (now - last < intervalMs) return; // 未到间隔

  lastRun.set(monitor.id, now);
  console.log(`[${new Date().toISOString()}] 执行监控: ${monitor.name} (${monitor.type})`);

  const start = Date.now();
  let result;
  try {
    result = await monitors[monitor.type](monitor);
  } catch (err) {
    result = { status: 'down', error: err.message };
  }
  const responseTime = Date.now() - start;

  // 保存到数据库
  const stmt = db.prepare(
    'INSERT INTO heartbeats (monitor_id, status, response_time, response_code, error) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(monitor.id, result.status, responseTime, result.code || null, result.error || null);

  // 获取上一次状态（用于判断状态变化）
  const prev = db.prepare(
    'SELECT status FROM heartbeats WHERE monitor_id = ? ORDER BY id DESC LIMIT 1 OFFSET 1'
  ).get(monitor.id);
  const prevStatus = prev ? prev.status : 'up';

  // 触发告警逻辑
  if (result.status === 'down' && prevStatus === 'up') {
    notifier.send(monitor, '宕机', result.error || '无响应');
  } else if (result.status === 'up' && result.code && result.code >= 400 && result.code < 600) {
    // HTTP 状态码异常（4xx/5xx）
    const thresholdCodes = monitor.threshold_http_code ? monitor.threshold_http_code.split(',').map(c => parseInt(c.trim())) : [];
    if (!thresholdCodes.includes(result.code)) {
      notifier.send(monitor, 'HTTP错误', `状态码 ${result.code}`);
    }
  } else if (monitor.threshold_response_time && responseTime > monitor.threshold_response_time) {
    notifier.send(monitor, '响应慢', `${responseTime}ms > ${monitor.threshold_response_time}ms`);
  }
}

// 启动调度器（每分钟执行一次）
function start() {
  cron.schedule('* * * * *', () => {
    const monitorsList = db.prepare('SELECT * FROM monitors WHERE enabled = 1').all();
    monitorsList.forEach(runMonitor);
  });
  console.log('监控调度器已启动');
}

module.exports = { start };
