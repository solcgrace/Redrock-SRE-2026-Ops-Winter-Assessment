const fetch = require('node-fetch');

const WEBHOOK_URL = process.env.WEBHOOK_URL;

function send(payload) {
  if (!WEBHOOK_URL) return;
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error('Webhook 错误:', err));
}

module.exports = { send };
