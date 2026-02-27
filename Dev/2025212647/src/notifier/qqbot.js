const fetch = require('node-fetch');

const QQ_BOT_URL = process.env.QQ_BOT_URL;
const QQ_GROUP_ID = process.env.QQ_GROUP_ID;

function send(payload) {
  if (!QQ_BOT_URL || !QQ_GROUP_ID) return;
  const body = {
    group_id: QQ_GROUP_ID,
    message: `[监控告警] ${payload.monitor} - ${payload.type}: ${payload.message}`
  };
  fetch(QQ_BOT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).catch(err => console.error('QQ机器人错误:', err));
}

module.exports = { send };
