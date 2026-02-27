const dns = require('dns').promises;

module.exports = async (monitor) => {
  try {
    const start = Date.now();
    await dns.lookup(monitor.target);
    const ms = Date.now() - start;
    return { status: 'up', responseTime: ms };
  } catch (err) {
    return { status: 'down', error: err.message };
  }
};
