const webhook = require('./webhook');
const qqbot = require('./qqbot');

// 通知器列表（可根据环境变量动态启用）
const notifiers = [webhook, qqbot];

function send(monitor, alertType, message) {
  const payload = {
    monitor: monitor.name,
    type: alertType,
    message,
    time: new Date().toISOString(),
    target: monitor.target
  };
  notifiers.forEach(notifier => {
    try {
      notifier.send(payload);
    } catch (err) {
      console.error('通知发送失败:', err);
    }
  });
}

module.exports = { send };
