// ===================== Service Worker 演示服务器 =====================
const express = require("express");
const webpush = require("web-push");
const path = require("path");

const app = express();
const PORT = 3001;

// ---------- 生成 VAPID 密钥（用于 Web Push）----------
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  "mailto:demo@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);
console.log("VAPID 密钥已生成，每次重启会变化");

// ---------- 内存存储 ----------
const subscriptions = []; // 推送订阅列表
const syncLogs = []; // 后台同步日志

app.use(express.json());
app.use(express.static(__dirname));

// ===================== API 端点 =====================

// 1. 获取 VAPID 公钥（页面需要它来订阅推送）
app.get("/vapid-public-key", (_req, res) => {
  res.json({ publicKey: vapidKeys.publicKey });
});

// 2. 订阅推送通知
app.post("/subscribe", (req, res) => {
  const sub = req.body;
  const exists = subscriptions.find((s) => s.endpoint === sub.endpoint);
  if (!exists) {
    subscriptions.push(sub);
    console.log(`[订阅] 新增订阅，当前共 ${subscriptions.length} 个`);
  }
  res.json({ success: true, count: subscriptions.length });
});

// 3. 触发推送通知
app.post("/push", (req, res) => {
  const payload = JSON.stringify({
    title: "测试推送通知",
    body:
      req.body.body || `来自服务器的推送 — ${new Date().toLocaleTimeString()}`,
  });

  if (subscriptions.length === 0) {
    return res.json({
      success: false,
      message: "暂无订阅客户端，请先在浏览器中订阅推送",
    });
  }

  const results = [];
  Promise.all(
    subscriptions.map((sub, i) =>
      webpush
        .sendNotification(sub, payload)
        .then(() => results.push({ index: i, status: "ok" }))
        .catch((err) => {
          results.push({ index: i, status: "fail", error: err.statusCode });
          // 410/404 表示订阅已过期，移除
          if (err.statusCode === 410 || err.statusCode === 404) {
            subscriptions.splice(i, 1);
          }
        }),
    ),
  ).then(() => {
    console.log(`[推送] 发送完成: ${JSON.stringify(results)}`);
    res.json({ success: true, results, remainingSubs: subscriptions.length });
  });
});

// 4. 后台同步端点（SW 离线数据上传目标）
app.post("/sync", (req, res) => {
  const entry = {
    time: new Date().toISOString(),
    data: req.body,
  };
  syncLogs.push(entry);
  console.log(`[后台同步] 收到数据:`, req.body);
  // 只保留最近 50 条
  if (syncLogs.length > 50) syncLogs.shift();
  res.json({ success: true, message: "离线数据已同步到服务器" });
});

// 5. 查看同步日志
app.get("/sync-logs", (_req, res) => {
  res.json(syncLogs);
});

// 6. 服务器状态
app.get("/status", (_req, res) => {
  res.json({
    subscriptions: subscriptions.length,
    syncLogs: syncLogs.length,
    vapidPublicKey: vapidKeys.publicKey,
  });
});

// ===================== 管理控制台页面 =====================
app.get("/admin", (_req, res) => {
  res.send(`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>SW 演示 — 管理控制台</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; padding: 2rem; }
    h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #38bdf8; }
    .card { background: #1e293b; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; max-width: 600px; }
    .card h2 { font-size: 1rem; margin-bottom: 1rem; color: #94a3b8; }
    label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.3rem; }
    input, textarea { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #334155; border-radius: 8px; background: #0f172a; color: #e2e8f0; font-size: 0.9rem; margin-bottom: 0.8rem; }
    button { padding: 0.6rem 1.5rem; border: none; border-radius: 8px; font-size: 0.9rem; cursor: pointer; font-weight: 600; transition: opacity .2s; }
    button:hover { opacity: 0.85; }
    .btn-push { background: #38bdf8; color: #0f172a; }
    .btn-refresh { background: #475569; color: #e2e8f0; }
    .btn-test { background: #10b981; color: #fff; margin-right: 0.5rem; }
    pre { background: #0f172a; padding: 1rem; border-radius: 8px; font-size: 0.8rem; overflow-x: auto; max-height: 300px; overflow-y: auto; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
    .badge-ok { background: #10b981; color: #fff; }
    .badge-warn { background: #f59e0b; color: #0f172a; }
    .row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.8rem; }
    .hint { font-size: 0.8rem; color: #64748b; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <h1>⚙️ Service Worker 演示 — 管理控制台</h1>

  <div class="card">
    <h2>📡 服务器状态</h2>
    <div class="row">
      <span>推送订阅数：</span><span class="badge badge-ok" id="subCount">-</span>
    </div>
    <div class="row">
      <span>同步日志数：</span><span class="badge badge-ok" id="logCount">-</span>
    </div>
    <button class="btn-refresh" onclick="refreshStatus()">刷新状态</button>
  </div>

  <div class="card">
    <h2>🔔 发送推送通知（验证推送通知功能）</h2>
    <label>通知标题</label>
    <input id="pushTitle" value="Service Worker 测试" />
    <label>通知内容</label>
    <textarea id="pushBody" rows="2">验证成功！推送通知功能正常工作 🎉</textarea>
    <button class="btn-push" onclick="sendPush()">发送推送通知</button>
    <p class="hint">前提：在主页 index.html 中已点击"订阅推送通知"按钮</p>
    <pre id="pushResult" style="display:none;"></pre>
  </div>

  <div class="card">
    <h2>🔄 后台同步日志</h2>
    <button class="btn-refresh" onclick="refreshSyncLogs()">刷新日志</button>
    <pre id="syncLogs">点击刷新查看...</pre>
  </div>

  <div class="card">
    <h2>🧪 快速验证指南</h2>
    <ol style="font-size:0.85rem; color:#94a3b8; padding-left:1.2rem; line-height:1.8;">
      <li>打开 <a href="/" style="color:#38bdf8;">主页 (index.html)</a>，观察控制台 SW 注册状态</li>
      <li><b>离线缓存</b>：加载主页后，停止服务器 (Ctrl+C)，刷新页面 — 页面仍能显示</li>
      <li><b>消息通信</b>：在主页点击"向 SW 发送消息"按钮</li>
      <li><b>推送通知</b>：在主页先订阅推送，然后在本页发送推送通知</li>
      <li><b>后台同步</b>：在主页注册后台同步，然后在 DevTools → Application → Service Workers → 输入 "sync-offline-data" 并点击 Sync 按钮手动触发</li>
    </ol>
  </div>

  <script>
    async function refreshStatus() {
      const r = await fetch('/status'); const d = await r.json();
      document.getElementById('subCount').textContent = d.subscriptions;
      document.getElementById('logCount').textContent = d.syncLogs;
    }
    async function sendPush() {
      const title = document.getElementById('pushTitle').value;
      const body = document.getElementById('pushBody').value;
      const r = await fetch('/push', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({title, body}) });
      const d = await r.json();
      const el = document.getElementById('pushResult');
      el.style.display = 'block';
      el.textContent = JSON.stringify(d, null, 2);
    }
    async function refreshSyncLogs() {
      const r = await fetch('/sync-logs'); const d = await r.json();
      document.getElementById('syncLogs').textContent = JSON.stringify(d, null, 2);
    }
    refreshStatus();
    refreshSyncLogs();
  </script>
</body>
</html>`);
});

// ===================== 启动 =====================
app.listen(PORT, () => {
  console.log("═══════════════════════════════════════════");
  console.log(`  🚀 服务器已启动: http://localhost:${PORT}`);
  console.log(`  📋 管理控制台:   http://localhost:${PORT}/admin`);
  console.log(`  📦 静态页面:     http://localhost:${PORT}/index.html`);
  console.log("═══════════════════════════════════════════");
  console.log("");
  console.log("  验证步骤：");
  console.log("  1. 打开 http://localhost:3000 查看主页面");
  console.log("  2. 打开 /admin 管理控制台发送推送通知");
  console.log("  3. 停止服务器验证离线缓存功能");
  console.log("");
});
