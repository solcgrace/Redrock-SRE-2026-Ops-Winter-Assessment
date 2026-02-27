const apiBase = '/api';
let monitors = [];

// 加载监控项列表
async function loadMonitors() {
    const res = await fetch(`${apiBase}/monitors`);
    monitors = await res.json();
    renderMonitors();
}

// 渲染卡片
function renderMonitors() {
    const container = document.getElementById('monitorsList');
    container.innerHTML = '';
    monitors.forEach(m => {
        const card = document.createElement('div');
        card.className = `monitor-card ${m.enabled ? 'enabled' : 'disabled'}`;

        // 获取最新状态（可能需要额外请求)
        // 实际可以从每个卡片内再请求最新心跳，但为了减少请求，将在加载时一并获取状态
        fetch(`${apiBase}/monitors/${m.id}/history?limit=1`)
            .then(res => res.json())
            .then(history => {
                const last = history[0] || { status: 'unknown' };
                card.innerHTML = `
                    <div class="monitor-header">
                        <span class="monitor-name">${m.name}</span>
                        <span class="monitor-status status-${last.status}">${last.status}</span>
                    </div>
                    <div class="monitor-detail">类型: ${m.type}</div>
                    <div class="monitor-detail">目标: ${m.target}</div>
                    <div class="monitor-detail">间隔: ${m.interval}s</div>
                    <div class="monitor-detail">超时: ${m.timeout}s</div>
                    ${last.response_time ? `<div class="monitor-detail">响应: ${last.response_time}ms</div>` : ''}
                    ${last.error ? `<div class="monitor-detail error">错误: ${last.error}</div>` : ''}
                    <div class="monitor-actions">
                        <button onclick="editMonitor(${m.id})">编辑</button>
                        <button onclick="deleteMonitor(${m.id})">删除</button>
                    </div>
                `;
            });
        container.appendChild(card);
    });
}

// 打开添加模态框
document.getElementById('addMonitorBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').innerText = '添加监控项';
    document.getElementById('monitorForm').reset();
    document.getElementById('monitorId').value = '';
    document.getElementById('enabled').checked = true;
    document.getElementById('monitorModal').style.display = 'block';
});

// 编辑监控项
window.editMonitor = (id) => {
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) return;
    document.getElementById('modalTitle').innerText = '编辑监控项';
    document.getElementById('monitorId').value = monitor.id;
    document.getElementById('name').value = monitor.name;
    document.getElementById('type').value = monitor.type;
    document.getElementById('target').value = monitor.target;
    document.getElementById('interval').value = monitor.interval;
    document.getElementById('timeout').value = monitor.timeout;
    document.getElementById('threshold_http_code').value = monitor.threshold_http_code || '';
    document.getElementById('threshold_response_time').value = monitor.threshold_response_time || 0;
    document.getElementById('enabled').checked = monitor.enabled === 1;
    document.getElementById('monitorModal').style.display = 'block';
};

// 删除监控项
window.deleteMonitor = async (id) => {
    if (!confirm('确定删除吗？')) return;
    await fetch(`${apiBase}/monitors/${id}`, { method: 'DELETE' });
    loadMonitors();
};

// 表单提交
document.getElementById('monitorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('monitorId').value;
    const data = {
        name: document.getElementById('name').value,
        type: document.getElementById('type').value,
        target: document.getElementById('target').value,
        interval: parseInt(document.getElementById('interval').value),
        timeout: parseInt(document.getElementById('timeout').value),
        threshold_http_code: document.getElementById('threshold_http_code').value || null,
        threshold_response_time: parseInt(document.getElementById('threshold_response_time').value) || null,
        enabled: document.getElementById('enabled').checked ? 1 : 0
    };
    if (id) {
        await fetch(`${apiBase}/monitors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } else {
        await fetch(`${apiBase}/monitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }
    document.getElementById('monitorModal').style.display = 'none';
    loadMonitors();
});

// 关闭模态框
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('monitorModal').style.display = 'none';
});

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// 初始化加载
loadMonitors();
