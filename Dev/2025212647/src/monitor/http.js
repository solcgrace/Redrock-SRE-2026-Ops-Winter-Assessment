const fetch = require('node-fetch');

module.exports = async (monitor) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), monitor.timeout * 1000);

  try {
    const res = await fetch(monitor.target, { signal: controller.signal });
    clearTimeout(timeout);
    return {
      status: res.ok ? 'up' : 'down',
      code: res.status
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      status: 'down',
      error: err.message
    };
  }
};
