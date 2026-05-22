import puppeteer from "puppeteer";
import { createServer } from "node:http";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  cpSync,
  rmSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const spaDir = join(rootDir, "dist-spa");
const prerenderDir = join(rootDir, "dist");
const port = 4173;

function serveDist(req, res) {
  const urlPath = req.url.split("?")[0];
  let filePath = join(spaDir, urlPath === "/" ? "/index.html" : urlPath);

  if (!existsSync(filePath)) {
    filePath = join(spaDir, "index.html");
  }

  try {
    const content = readFileSync(filePath);
    const ext = filePath.split(".").pop();
    const mime = {
      html: "text/html",
      js: "application/javascript",
      css: "text/css",
      svg: "image/svg+xml",
      png: "image/png",
      ico: "image/x-icon",
      json: "application/json",
    };
    res.writeHead(200, { "Content-Type": mime[ext] || "text/plain" });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
}

async function prerender() {
  console.log("=== Pre-rendering SPA pages ===\n");

  // Copy SPA assets to prerender output dir
  if (existsSync(prerenderDir)) rmSync(prerenderDir, { recursive: true });
  cpSync(spaDir, prerenderDir, { recursive: true });
  console.log("Copied SPA build to dist/");

  // Start static server serving the SPA build
  const server = createServer(serveDist);
  await new Promise((resolve) => server.listen(port, resolve));
  console.log(`Static server: http://localhost:${port}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();

  try {
    // ---- Prerender Home (heavy page) ----
    console.log("Prerendering / (heavy page with 500 rows)...");
    const start = Date.now();
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle0" });

    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.querySelector(".stat-card")) {
          resolve();
          return;
        }
        document.addEventListener("app-rendered", () => resolve(), {
          once: true,
        });
        setTimeout(resolve, 8000);
      });
    });

    const html = await page.content();
    writeFileSync(join(prerenderDir, "index.html"), html);
    console.log(`  Done in ${Date.now() - start}ms\n`);

    // ---- Prerender About ----
    console.log("Prerendering /about ...");
    await page.goto(`http://localhost:${port}/about`, {
      waitUntil: "networkidle0",
    });
    const aboutHtml = await page.content();
    mkdirSync(join(prerenderDir, "about"), { recursive: true });
    writeFileSync(join(prerenderDir, "about", "index.html"), aboutHtml);
    console.log("  Done\n");

    // ---- Prerender Contact ----
    console.log("Prerendering /contact ...");
    await page.goto(`http://localhost:${port}/contact`, {
      waitUntil: "networkidle0",
    });
    const contactHtml = await page.content();
    mkdirSync(join(prerenderDir, "contact"), { recursive: true });
    writeFileSync(join(prerenderDir, "contact", "index.html"), contactHtml);
    console.log("  Done\n");

    // ---- Summary ----
    const spaSize = readFileSync(join(spaDir, "index.html"), "utf-8").length;
    const prerenderSize = html.length;
    const hasData = html.includes("User_0001");

    console.log("=== Prerender Complete ===");
    console.log(
      `SPA index.html:        ${spaSize.toLocaleString()} bytes (empty shell)`,
    );
    console.log(
      `Prerendered index.html: ${prerenderSize.toLocaleString()} bytes (full content)`,
    );
    console.log(`Contains prerendered data: ${hasData ? "YES" : "NO"}`);
    console.log("");
    console.log("Compare:");
    console.log(
      "  npm run preview:spa        -> SPA (slow first screen, loading spinner)",
    );
    console.log(
      "  npm run preview:prerender  -> Prerendered (instant content, no spinner)",
    );
  } finally {
    await browser.close();
    server.close();
  }
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
