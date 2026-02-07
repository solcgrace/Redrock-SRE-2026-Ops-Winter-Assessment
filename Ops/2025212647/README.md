# 寒假考核作业————网络配置管理工具        


## 源码内容整理
- 配置变量和数据存储位置
- 显示使用方法
- 日志
- 备份
- 恢复
- 办公网络配置和生产网络配置
- 生产网络隔离
- 检查网络状态和自动检测并切换
- 主程序


## 项目介绍
这是一个能完成网络配置和验证工作的网络配置管理工具，用于在不同网络环境（办公网络/生产网络）之间的快速切换，并提供网络隔离和自动检测功能。


## 功能特性
- 日志记录
- 配置备份与恢复
- 办公网络模式：DHCP自动获取IP
- 生产网络模式：静态IP配置
- 网络隔离：禁止生产网络访问公网
- 自动检测：监控网络违规并自动切换


## 系统要求
- 操作系统：Kali Linux
- 权限要求：root权限（使用sudo）
- 网络接口：eth0（默认）


## 快速开始
### 安装方法
方法一：直接下载使用
```bash
# 下载主脚本
wget https://raw.githubusercontent.com/solcgrace/network_tool/main/setup.sh
# 下载自动检测脚本
wget https://raw.githubusercontent.com/solcgrace/network_tool/main/auto_check.sh
# 给予执行权限
chmod +x setup.sh
chmod +x auto_check.sh
# 查看帮助
sudo ./setup.sh --help
```

方法二：完整安装
```bash
# 克隆整个项目
git clone https://github.com/solcgrace/network_tool.git
cd operations
# 运行安装脚本（如果存在）
sudo ./install.sh
# 或者手动安装
sudo cp setup.sh /usr/local/bin/nwconfig
sudo chmod +x /usr/local/bin/nwconfig
```


## 使用指南
### 基本命令
```bash
# 查看帮助
sudo nwconfig --help
# 切换到办公网络（DHCP）
sudo nwconfig dhcp
# 切换到生产网络（静态IP）
sudo nwconfig static
# 配置生产网络隔离
sudo nwconfig isolate
# 检查网络状态
sudo nwconfig check
# 备份当前配置
sudo nwconfig backup
# 恢复备份配置
sudo nwconfig restore
```


##  配置说明
参数  |  值
---- |  ----
网卡  |  eth0
IP地址  |  172.22.146.150
子网掩码  |  255.255.255.0
网段  |  172.22.146.0/24
默认网关  |  172.22.146.1
主DNS  |  172.22.146.53
备DNS  |  172.22.146.54
