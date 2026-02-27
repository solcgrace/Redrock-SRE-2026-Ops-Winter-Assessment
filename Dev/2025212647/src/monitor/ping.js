const Ping = require('ping-lite');

module.exports = (monitor) => {
  return new Promise((resolve) => {
    const ping = new Ping(monitor.target, {
      timeout: monitor.timeout * 1000
    });
    ping.send((err, ms) => {
      if (err || ms === null) {
        resolve({ status: 'down', error: err ? err.message : '无响应' });
      } else {
        resolve({ status: 'up', responseTime: ms });
      }
    });
  });
};
