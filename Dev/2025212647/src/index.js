const express = require('express');
const path = require('path');
const db = require('./database');
const apiRoutes = require('./routes/api');
const statusRoutes = require('./routes/status');
const monitorScheduler = require('./monitor');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api', apiRoutes);
app.use('/status', statusRoutes); // 公开状态页面

// 启动服务器
app.listen(PORT, () => {
  console.log(`SimpleMonitor 运行在 http://localhost:${PORT}`);
  // 初始化数据库表
  db.init();
  // 启动监控调度器
  monitorScheduler.start();
});
