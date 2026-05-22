// ==================== 工具函数 ====================
function log(msg, type = "info") {
  const ts = new Date().toLocaleTimeString();
  const cls = { ok: "ok", err: "err", info: "info" }[type] || "info";
  const area = document.getElementById("logArea");
  if (area) {
    if (
      area
        .querySelector(".log-entry:first-child")
        ?.textContent.includes("等待操作")
    ) {
      area.innerHTML = "";
    }
    area.innerHTML += `<div class="log-entry"><span class="ts">${ts}</span><span class="${cls}">${msg}</span></div>`;
    area.scrollTop = area.scrollHeight;
  }
  console.log(`[页面] ${msg}`);
}

function setStatus(dotId, txtId, dotClass, text) {
  const dot = document.getElementById(dotId);
  const txt = document.getElementById(txtId);
  if (dot) dot.className = `dot ${dotClass}`;
  if (txt) txt.textContent = text;
}

// ==================== 1. 注册 Service Worker ====================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "./service-worker.js",
      );
      log("Service Worker 注册成功 ✓", "ok");
      window.swRegistration = registration;
      setStatus("dotSw", "txtSw", "dot-green", "SW: 已注册 ✓");

      // 监听 SW 更新
      registration.addEventListener("updatefound", () => {
        log("发现新版本 SW，正在安装...", "info");
      });

      // 检测是否被 SW 控制
      if (navigator.serviceWorker.controller) {
        log("当前页面已被 SW 控制", "ok");
      } else {
        log("SW 尚未控制本页面（刷新后生效）", "info");
      }

      // 检测后台同步支持
      if (registration.sync) {
        setStatus("dotSync", "txtSync", "dot-green", "后台同步: 支持 ✓");
        log("后台同步 API 可用", "ok");
      } else {
        setStatus("dotSync", "txtSync", "dot-red", "后台同步: 不支持 ✗");
        log("后台同步 API 不可用（仅 Chrome 支持）", "err");
      }
    } catch (err) {
      log(`SW 注册失败: ${err.message}`, "err");
      setStatus("dotSw", "txtSw", "dot-red", "SW: 注册失败 ✗");
    }
  });
} else {
  log("浏览器不支持 Service Worker", "err");
  setStatus("dotSw", "txtSw", "dot-red", "SW: 不支持 ✗");
}

// ==================== 2. 接收 SW 消息 ====================
navigator.serviceWorker.addEventListener("message", (event) => {
  log(`收到 SW 回复: ${JSON.stringify(event.data)}`, "ok");
});

// ==================== 3. 消息通信 ====================
document.querySelector("#sendMsg")?.addEventListener("click", () => {
  if (!navigator.serviceWorker.controller) {
    log("SW 尚未控制页面，请刷新后再试", "err");
    return;
  }
  navigator.serviceWorker.controller.postMessage({
    type: "TEST_MSG",
    data: "你好，Service Worker！",
  });
  log("已向 SW 发送消息", "info");
});

// 额外消息测试按钮
document.querySelector("#sendMsg2")?.addEventListener("click", () => {
  if (!navigator.serviceWorker.controller) {
    log("SW 尚未控制页面，请刷新后再试", "err");
    return;
  }
  navigator.serviceWorker.controller.postMessage({
    type: "TEST_MSG",
    data: `带时间戳的消息 — ${new Date().toLocaleTimeString()}`,
  });
  log("已向 SW 发送带时间戳的消息", "info");
});

// ==================== 4. 推送通知 ====================
// 4a. 申请权限
document
  .querySelector("#requestNotify")
  ?.addEventListener("click", async () => {
    if (!("Notification" in window)) {
      log("浏览器不支持通知 API", "err");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      log("通知权限已开启 ✓", "ok");
      setStatus("dotPush", "txtPush", "dot-green", "推送: 权限已开启 ✓");
    } else {
      log(`通知权限: ${permission}`, "err");
      setStatus("dotPush", "txtPush", "dot-red", "推送: 权限被拒绝 ✗");
    }
  });

// 4b. 订阅推送
document
  .querySelector("#subscribePush")
  ?.addEventListener("click", async () => {
    if (!window.swRegistration) {
      log("SW 尚未注册完成，请稍候", "err");
      return;
    }
    if (Notification.permission !== "granted") {
      log("请先申请通知权限", "err");
      return;
    }

    try {
      // 先检查是否已有旧订阅（可能是不同 VAPID key 的）
      // getSubscription() 在存储损坏时也可能抛 "storage error"
      let existingSubscription = null;
      try {
        existingSubscription =
          await window.swRegistration.pushManager.getSubscription();
      } catch (storageErr) {
        log(`读取订阅存储失败: ${storageErr.message}`, "err");
        log("尝试注销 SW 以清理损坏的存储...", "info");
        await window.swRegistration.unregister();
        // 延迟后重新注册 SW
        await new Promise((r) => setTimeout(r, 500));
        const newReg = await navigator.serviceWorker.register(
          "./service-worker.js",
        );
        window.swRegistration = newReg;
        log("SW 已重新注册，存储已重置 ✓", "ok");
      }

      if (existingSubscription) {
        log("检测到旧推送订阅，正在取消...", "info");
        const unsubOk = await existingSubscription.unsubscribe();
        log(
          unsubOk ? "旧订阅已取消 ✓" : "取消旧订阅失败",
          unsubOk ? "ok" : "err",
        );
        // 给浏览器一点时间清理存储
        await new Promise((r) => setTimeout(r, 300));
      }

      // 从服务器获取 VAPID 公钥
      const vapidResp = await fetch("/vapid-public-key");
      const { publicKey } = await vapidResp.json();

      // 将公钥转为 Uint8Array
      const convertedKey = urlBase64ToUint8Array(publicKey);

      // 订阅推送（必须传 Uint8Array，不能传原始 base64 字符串）
      const subscription = await window.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      // 将订阅信息发送给服务器
      await fetch("/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      log("推送订阅成功 ✓ 服务器已记录", "ok");
      setStatus("dotPush", "txtPush", "dot-green", "推送: 已订阅 ✓");
    } catch (err) {
      log(`推送订阅失败: ${err.message}`, "err");
      setStatus("dotPush", "txtPush", "dot-red", "推送: 订阅失败 ✗");
    }
  });

// VAPID 公钥转换辅助函数
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

// ==================== 5. 后台同步 ====================
document.querySelector("#syncData")?.addEventListener("click", async () => {
  if (!window.swRegistration?.sync) {
    log("浏览器不支持后台同步", "err");
    return;
  }
  try {
    await window.swRegistration.sync.register("sync-offline-data");
    log("后台同步任务「sync-offline-data」注册成功 ✓", "ok");
    log(
      "提示: 在 DevTools → Application → Service Workers → Sync 手动触发",
      "info",
    );
  } catch (err) {
    log(`后台同步注册失败: ${err.message}`, "err");
  }
});

// ==================== 6. 离线缓存检查 ====================
document.querySelector("#checkCache")?.addEventListener("click", async () => {
  if (!("caches" in window)) {
    log("浏览器不支持 Cache API", "err");
    return;
  }
  try {
    const cacheNames = await caches.keys();
    log(
      `当前缓存列表: ${cacheNames.length ? cacheNames.join(", ") : "无"}`,
      "info",
    );

    if (cacheNames.length > 0) {
      const cache = await caches.open(cacheNames[0]);
      const keys = await cache.keys();
      log(`缓存「${cacheNames[0]}」包含 ${keys.length} 个资源:`, "info");
      keys.forEach((req) => log(`  → ${req.url}`, "info"));
    }
  } catch (err) {
    log(`缓存检查失败: ${err.message}`, "err");
  }
});

// ==================== 7. 注销 Service Worker ====================
document.querySelector("#unregisterSw")?.addEventListener("click", async () => {
  if (!window.swRegistration) {
    log("没有已注册的 SW", "err");
    return;
  }
  const ok = await window.swRegistration.unregister();
  if (ok) {
    log("Service Worker 已注销 ✓（刷新页面后不再受 SW 控制）", "ok");
    setStatus("dotSw", "txtSw", "dot-red", "SW: 已注销");
    // 清空缓存
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((n) => caches.delete(n)));
    log("所有缓存已清空", "info");
  } else {
    log("SW 注销失败", "err");
  }
});
