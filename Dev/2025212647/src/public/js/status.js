const apiBase = '/api';

// 加载状态数据
async function loadStatus() {
    const res = await fetch(`${apiBase}/status`);
    const data = await res.json();
    renderSummary(data);
    renderCharts(data);
}

function renderSummary(data) {
    const container = document.getElementById('summaryCards');
    container.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = `summary-card`;
        const status = item.last ? item.last.status : 'unknown';
        card.innerHTML = `
            <div class="monitor-header">
                <span class="monitor-name">${item.name}</span>
                <span class="monitor-status status-${status}">${status}</span>
            </div>
            <div class="monitor-detail">类型: ${item.type}</div>
            <div class="monitor-detail">目标: ${item.target}</div>
            ${item.last && item.last.response_time ? `<div class="monitor-detail">最新响应: ${item.last.response_time}ms</div>` : ''}
            ${item.last && item.last.error ? `<div class="monitor-detail error">错误: ${item.last.error}</div>` : ''}
            <div class="monitor-detail">24h可用性: ${item.uptime}%</div>
        `;
        container.appendChild(card);
    });
}

async function renderCharts(data) {
    const container = document.getElementById('chartsContainer');
    container.innerHTML = '';
    for (const item of data) {
        // 获取最近24小时的心跳数据（按小时聚合或原始点，简单取最近100条）
        const historyRes = await fetch(`${apiBase}/monitors/${item.id}/history?limit=100`);
        const history = await historyRes.json();
        if (history.length === 0) continue;

        // 反转以便时间正序
        const points = history.reverse();
        const labels = points.map(p => new Date(p.created_at).toLocaleTimeString());
        const values = points.map(p => p.status === 'up' ? 1 : 0);

        const card = document.createElement('div');
        card.className = 'chart-card';
        card.innerHTML = `<h3>${item.name} (${item.target})</h3><canvas id="chart-${item.id}"></canvas>`;
        container.appendChild(card);

        const ctx = document.getElementById(`chart-${item.id}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '状态 (1=正常, 0=异常)',
                    data: values,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.1,
                    stepped: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: -0.2,
                        max: 1.2,
                        ticks: { stepSize: 1, callback: value => value === 1 ? '正常' : '异常' }
                    }
                }
            }
        });
    }
}

loadStatus();
