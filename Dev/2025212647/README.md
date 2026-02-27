# SimpleMonitor - 轻量级运维监控系统

SimpleMonitor 是一个简单易用的自托管监控系统，灵感来自 Uptime Kuma，但更轻量、代码简洁。

## 功能特性

- 支持 HTTP(s)、TCP端口、Ping、DNS 监控
- 自定义监控间隔、超时、告警阈值
- 简洁的 Web 仪表盘（添加/编辑/删除监控项）
- 公开状态页面，展示实时状态和24小时可用性图表
- 告警通知：Webhook 和 QQ机器人
- 异常检测：状态码异常、响应延迟、服务宕机
- Docker 一键部署

## 快速开始

### 使用 Docker Compose（推荐）

```bash
git clone https://github.com/solcgrace/solcgrace/Redrock-SRE-2026-Ops-Winter-Assessment.git
cd Redrock-SRE-2026-Ops-Winter-Assessment/Dev/2025212647
docker-compose up -d
```
访问`http://localhost:3000`进入仪表盘
## 手动运行

```bash
npm install
npm start
```

## 配置告警通知
在`docker-compose.yml`中设置环境变量：

- `WEBHOOK_URL`：通用 Webhook 地址（支持POST JSON）

- `QQ_BOT_URL`：QQ机器人 API 地址，例如`http://192.168.1.100:5700/send_group_msg`

重启容器生效。

## 使用指南

1. *添加监控项*：点击“添加监控项”，填写名称、类型、目标等。

HTTP：目标为完整URL（如`https://example.com`）

TCP：目标为`host:port`（如`google.com:80`）

Ping：目标为域名或IP

DNS：目标为域名
2. *自定义阈值*：

期望HTTP状态码：逗号分隔，如`200,302`

响应时间阈值：毫秒，超过即告警

3. *查看状态*：仪表盘显示每个监控项的最新状态和响应时间。公开状态页（`/status`）显示所有服务的概览和24小时可用性图表。

## 项目结构
```text
simple-monitor/
├── src/
│   ├── index.js           # 入口
│   ├── database.js        # 数据库初始化
│   ├── monitor/           # 监控实现
│   ├── notifier/          # 通知实现
│   ├── routes/            # API路由
│   └── public/            # 前端静态文件
├── data/                  # 数据库挂载卷
├── package.json           # 项目依赖和脚本
├── Dockerfile
├── docker-compose.yml
└── README.md
```
