const net = require('net');

module.exports = (monitor) => {
  return new Promise((resolve) => {
    const [host, port] = monitor.target.split(':');
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve({ status: 'down', error: '连接超时' });
    }, monitor.timeout * 1000);

    socket.connect(parseInt(port), host, () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve({ status: 'up' });
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      resolve({ status: 'down', error: err.message });
    });
  });
};
