// ===================== 配置项 =====================
const CACHE_NAME = "sw-cache-v2"; // 缓存版本（更新版本号会自动清理旧缓存）
const CACHE_ASSETS = ["/", "/index.html", "/sw-register.js", "/admin"];
// 不缓存的 API 路径前缀（这些应该始终走网络）
const API_PATHS = [
  "/vapid-public-key",
  "/subscribe",
  "/push",
  "/sync",
  "/sync-logs",
  "/status",
];

// 判断是否为 API 请求（不缓存）
function isApiRequest(url) {
  return API_PATHS.some((p) => url.includes(p));
}

// ===================== 1. 安装事件：离线缓存 =====================
self.addEventListener("install", (event) => {
  console.log("[SW] install 事件触发 — 开始缓存静态资源");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] 正在缓存:", CACHE_ASSETS);
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => {
        console.log("[SW] 静态资源缓存完成，调用 skipWaiting()");
        return self.skipWaiting();
      }),
  );
});

// ===================== 2. 激活事件：清理旧缓存 =====================
self.addEventListener("activate", (event) => {
  console.log("[SW] activate 事件触发 — 开始清理旧缓存");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log("[SW] 删除旧缓存:", name);
              return caches.delete(name);
            }),
        );
      })
      .then(() => {
        console.log("[SW] 旧缓存清理完成，调用 clients.claim()");
        return self.clients.claim();
      })
      .then(() => {
        console.log("[SW] 已控制所有打开的页面");
      }),
  );
});

// ===================== 3. 请求拦截：缓存优先 + API 不过缓存 =====================
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // API 请求：直接走网络，不缓存
  if (isApiRequest(url.pathname)) {
    // 不拦截，浏览器正常请求
    return;
  }

  // 非 GET 请求（如 POST）：直接走网络
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[SW] 缓存命中:", url.pathname);
        return cachedResponse;
      }

      console.log("[SW] 缓存未命中，请求网络:", url.pathname);
      return fetch(event.request)
        .then((networkResponse) => {
          // 只缓存成功的响应
          if (networkResponse.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              console.log("[SW] 动态缓存:", url.pathname);
              return networkResponse;
            });
          }
          return networkResponse;
        })
        .catch(() => {
          console.log("[SW] 离线且无缓存:", url.pathname);
          // 对 HTML 页面请求返回离线页面
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return new Response(
              `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"/><title>离线</title>
              <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#e2e8f0;flex-direction:column;}
              h1{color:#38bdf8;}p{color:#94a3b8;}</style></head>
              <body><h1>📡 离线状态</h1><p>当前页面已通过 Service Worker 离线缓存加载</p><p style="font-size:0.8rem;color:#64748b;">停止服务器后刷新页面验证离线缓存功能</p></body></html>`,
              { status: 200, headers: { "Content-Type": "text/html" } },
            );
          }
          return new Response("离线状态，无法加载资源", { status: 200 });
        });
    }),
  );
});

// ===================== 4. 推送通知 =====================
self.addEventListener("push", (event) => {
  console.log("[SW] 收到推送事件");
  const data = event.data || {
    title: "默认通知",
    body: "你有一条新消息",
  };
  const options = {
    body: data.body,
    icon: "https://picsum.photos/64",
    badge: "https://picsum.photos/32",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
    tag: "sw-demo-notification",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options).then(() => {
      console.log("[SW] 通知已显示:", data.title);
    }),
  );
});

// 通知点击
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] 用户点击了通知");
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // 如果已有打开的窗口，聚焦它
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

// 推送订阅变化（如过期）
self.addEventListener("pushsubscriptionchange", (event) => {
  console.log("[SW] 推送订阅已变化，需要重新订阅");
  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true })
      .then((newSub) => {
        console.log("[SW] 已重新订阅推送");
        // 实际项目中应将新订阅发回服务器
        return fetch("/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSub),
        });
      }),
  );
});

// ===================== 5. 后台同步 =====================
self.addEventListener("sync", (event) => {
  console.log(`[SW] 收到 sync 事件: tag="${event.tag}"`);

  if (event.tag === "sync-offline-data") {
    event.waitUntil(
      fetch("/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offlineData: "模拟的离线数据",
          timestamp: new Date().toISOString(),
          source: "Service Worker Background Sync",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("[SW] 后台同步成功:", data);
          // 通知所有打开的页面同步完成
          return self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({
                type: "SYNC_COMPLETE",
                msg: "后台同步已完成！查看 /sync-logs 确认",
              });
            });
          });
        })
        .catch((err) => {
          console.error("[SW] 后台同步失败（浏览器会自动重试）:", err);
          throw err; // 抛出错误让浏览器自动重试
        }),
    );
  }
});

// ===================== 6. 消息传递 =====================
self.addEventListener("message", (event) => {
  console.log("[SW] 收到页面消息:", event.data);

  if (event.data.type === "TEST_MSG") {
    // 回复消息给页面
    event.source.postMessage({
      type: "REPLY",
      msg: `SW 已收到: 「${event.data.data}」`,
      swVersion: CACHE_NAME,
      timestamp: new Date().toISOString(),
    });
  }
});
