import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeData,
  ExecutionContext,
} from "../types/workflow";
import * as api from "./api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EngineCallbacks {
  onNodeStart: (nodeId: string) => void;
  onNodeComplete: (nodeId: string, output: unknown) => void;
  onNodeError: (nodeId: string, error: string) => void;
  animationDelay?: number;
}

// ---------------------------------------------------------------------------
// Server-side execution
// ---------------------------------------------------------------------------

/**
 * Execute the workflow on the server.
 * 1. Saves the workflow to get an ID (if not already saved).
 * 2. Calls POST /api/workflows/:id/execute to start execution.
 * 3. Polls GET /api/executions/:id until complete.
 * 4. Calls back with node status updates.
 */
export async function executeWorkflowServer(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  workflowName: string,
  workflowId: string | null,
  callbacks: EngineCallbacks,
): Promise<void> {
  // 1. Save workflow first
  let wfId = workflowId;
  if (!wfId) {
    const doc = await api.saveWorkflow({
      name: workflowName,
      nodes: nodes as any[],
      edges: edges as any[],
    });
    wfId = doc.id;
  } else {
    await api.saveWorkflow({
      id: wfId,
      name: workflowName,
      nodes: nodes as any[],
      edges: edges as any[],
    });
  }

  // 2. Kick off execution
  const { executionId } = await api.executeWorkflow(wfId);

  // 3. Poll until done
  const seenStatuses = new Map<string, string>();
  const delay = callbacks.animationDelay ?? 500;

  while (true) {
    await sleep(delay);
    const exec = await api.getExecution(executionId);

    // Check each node's status
    if (exec.nodeResults) {
      for (const [nodeId, result] of Object.entries(exec.nodeResults)) {
        const prev = seenStatuses.get(nodeId);
        if (prev !== result.status) {
          seenStatuses.set(nodeId, result.status);
          switch (result.status) {
            case "running":
              callbacks.onNodeStart(nodeId);
              break;
            case "completed":
              callbacks.onNodeComplete(nodeId, result.output);
              break;
            case "error":
              callbacks.onNodeError(nodeId, result.error ?? "Unknown error");
              break;
          }
        }
      }
    }

    if (exec.status === "completed" || exec.status === "failed") {
      if (exec.status === "failed" && exec.error) {
        console.error("Workflow execution failed:", exec.error);
      }
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Client-side execution (no server required)
// ---------------------------------------------------------------------------

/**
 * Execute a workflow entirely on the client side.
 * Useful when the backend is not running or for instant preview.
 */
export async function executeWorkflowClient(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  callbacks: EngineCallbacks,
  /** 运行时输入的参数值，key → value，会覆盖 start 节点的 inputParams 默认值 */
  runtimeInput: Record<string, string> = {},
): Promise<ExecutionContext> {
  const sorted = topologicalSort(nodes, edges);
  const { successors } = buildAdjacency(nodes, edges);
  const edgeMap = buildEdgeMap(edges);
  const skipped = new Set<string>();
  const delay = callbacks.animationDelay ?? 300;

  const ctx: ExecutionContext = {
    data: {},
    input: {},
    nodeOutputs: {},
    lastResult: null,
  };

  for (const node of sorted) {
    if (skipped.has(node.id)) continue;

    const data = node.data as WorkflowNodeData;

    // --- START ---
    if (node.type === "start") {
      callbacks.onNodeStart(node.id);
      const params = data.startConfig?.inputParams ?? [];
      for (const p of params) {
        if (p.key) {
          // 优先使用运行时输入值，否则用默认值
          ctx.input[p.key] =
            runtimeInput[p.key] !== undefined ? runtimeInput[p.key] : p.value;
        }
      }
      // 将 input 合并到 ctx.data（不带 data. 前缀，直接作为顶级字段）
      Object.assign(ctx.data, ctx.input);
      // 按节点名称暴露，下游可通过 {{开始}} 引用
      if (data.label) ctx.data[data.label] = ctx.input;
      ctx.lastResult = ctx.input;
      ctx.nodeOutputs[node.id] = ctx.input;
      await sleep(delay);
      callbacks.onNodeComplete(node.id, ctx.input);
      continue;
    }

    // --- END ---
    if (node.type === "end") {
      callbacks.onNodeStart(node.id);
      if (data.label) ctx.data[data.label] = ctx.lastResult;
      ctx.nodeOutputs[node.id] = ctx.lastResult;
      await sleep(delay);
      callbacks.onNodeComplete(node.id, ctx.lastResult);
      continue;
    }

    // --- CONDITION ---
    if (node.type === "condition") {
      callbacks.onNodeStart(node.id);
      const condConfig = data.conditionConfig;
      const expression = data.config?.expression as string | undefined;

      let result = true;
      if (expression) {
        result = evaluateConditionExpr(expression, ctx.data);
      } else if (condConfig?.field) {
        const fieldValue = resolveFieldValue(condConfig.field, ctx);
        result = evaluateCondition(fieldValue, condConfig.operator, condConfig.value);
      }

      ctx.lastResult = result;
      ctx.nodeOutputs[node.id] = result;
      // 按节点名称暴露，下游可通过 {{条件判断}} 引用
      if (data.label) ctx.data[data.label] = result;

      // Branch: skip nodes on the path not taken
      const takenHandle = result ? "true" : "false";
      const skippedHandle = result ? "false" : "true";

      const hm = edgeMap.get(node.id);
      if (hm) {
        for (const t of hm.get(skippedHandle) ?? []) {
          markSubtree(t, successors, skipped);
        }
        for (const t of hm.get(takenHandle) ?? []) {
          unmarkSubtree(t, successors, skipped);
        }
      }

      await sleep(delay);
      callbacks.onNodeComplete(node.id, result);
      continue;
    }

    // --- TASK ---
    if (node.type === "task") {
      callbacks.onNodeStart(node.id);

      try {
        const output = await executeTaskLocally(data, ctx);
        ctx.lastResult = output;
        ctx.nodeOutputs[node.id] = output;
        // 按节点名称暴露输出，下游可通过 {{节点名称}} 引用
        if (data.label) ctx.data[data.label] = output;
        await sleep(delay);
        callbacks.onNodeComplete(node.id, output);
      } catch (err: any) {
        callbacks.onNodeError(node.id, err.message ?? String(err));
        ctx.nodeOutputs[node.id] = null;
        ctx.lastResult = null;
      }
      continue;
    }
  }

  return ctx;
}

// ---------------------------------------------------------------------------
// Graph helpers
// ---------------------------------------------------------------------------

function buildAdjacency(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): { successors: Map<string, string[]>; predecessors: Map<string, string[]> } {
  const successors = new Map<string, string[]>();
  const predecessors = new Map<string, string[]>();

  for (const n of nodes) {
    successors.set(n.id, []);
    predecessors.set(n.id, []);
  }
  for (const e of edges) {
    successors.get(e.source)?.push(e.target);
    predecessors.get(e.target)?.push(e.source);
  }
  return { successors, predecessors };
}

function buildEdgeMap(edges: WorkflowEdge[]): Map<string, Map<string, string[]>> {
  const map = new Map<string, Map<string, string[]>>();
  for (const e of edges) {
    const handle = e.sourceHandle ?? "default";
    if (!map.has(e.source)) map.set(e.source, new Map());
    const hm = map.get(e.source)!;
    if (!hm.has(handle)) hm.set(handle, []);
    hm.get(handle)!.push(e.target);
  }
  return map;
}

function topologicalSort(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowNode[] {
  const { predecessors } = buildAdjacency(nodes, edges);
  const inDegree = new Map<string, number>();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  for (const n of nodes) {
    inDegree.set(n.id, (predecessors.get(n.id) ?? []).length);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: WorkflowNode[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    const node = nodeMap.get(id);
    if (node) sorted.push(node);

    for (const e of edges.filter((e) => e.source === id)) {
      const newDeg = (inDegree.get(e.target) ?? 1) - 1;
      inDegree.set(e.target, newDeg);
      if (newDeg === 0) queue.push(e.target);
    }
  }

  return sorted;
}

// ---------------------------------------------------------------------------
// Local task execution (matches backend behaviour)
// ---------------------------------------------------------------------------

async function executeTaskLocally(
  data: WorkflowNodeData,
  ctx: ExecutionContext,
): Promise<unknown> {
  const config = (data.config ?? {}) as Record<string, any>;

  switch (data.taskType) {
    case "http-request": {
      const { method = "GET", url, headers = {}, body } = config;
      if (!url) throw new Error("HTTP 请求缺少 url");
      const fetchOpts: RequestInit = {
        method,
        headers: { "Content-Type": "application/json", ...headers },
      };
      if (body && method !== "GET" && method !== "HEAD") {
        fetchOpts.body = typeof body === "string" ? body : JSON.stringify(body);
      }
      const startedAt = Date.now();
      const res = await fetch(url, fetchOpts);
      const elapsed = Date.now() - startedAt;
      const text = await res.text();
      let parsed: any;
      try { parsed = JSON.parse(text); } catch { parsed = text; }

      // Also update ctx.data with response so downstream nodes can use it
      Object.assign(ctx.data, { status: res.status, body: parsed });
      return { status: res.status, body: parsed, elapsed };
    }

    case "transform": {
      const { operation, fields, key, value, expression } = config;
      switch (operation) {
        case "pick": {
          if (!Array.isArray(fields)) throw new Error("pick 需要 fields 数组");
          const picked: Record<string, any> = {};
          for (const f of fields) {
            if (f in ctx.data) picked[f] = ctx.data[f];
          }
          Object.assign(ctx.data, picked);
          return picked;
        }
        case "set": {
          if (key) ctx.data[key] = value;
          return { [key]: value };
        }
        case "map": {
          if (!expression) throw new Error("map 需要 expression");
          const fn = new Function("data", `return (${expression})`);
          ctx.data = fn(ctx.data);
          return ctx.data;
        }
        default:
          throw new Error(`不支持的 transform 操作: ${operation}`);
      }
    }

    case "delay": {
      const { duration = 1000 } = config;
      const ms = Math.min(Math.max(Number(duration) || 1000, 0), 300_000);
      await sleep(ms);
      return { waited: ms };
    }

    case "log": {
      const { level = "info", message = "" } = config;
      const resolved = String(message).replace(
        /\{\{(.+?)\}\}/g,
        (_: string, key: string) => {
          const k = key.trim();
          return k in ctx.data ? JSON.stringify(ctx.data[k]) : `{{${k}}}`;
        },
      );
      console.log(`[workflow:log] [${level.toUpperCase()}] ${resolved}`);
      return { level, message: resolved };
    }

    case "script": {
      const { code = "" } = config;
      if (!code.trim()) throw new Error("script 缺少 code");
      const fn = new Function(
        "data",
        "utils",
        `const { JSON, Math, Date, Promise, Array, Object, String, Number, Boolean } = utils;
        return (async () => { ${code} })();`,
      );
      const result = await fn(ctx.data, {
        JSON, Math, Date, Promise, Array, Object, String, Number, Boolean,
      });
      return result !== undefined ? result : null;
    }

    case "llm": {
      const {
        model = "deepseek-chat",
        systemPrompt = "",
        userPrompt = "",
        temperature = 0.7,
        maxTokens = 2048,
        inputMapping,
      } = config;

      if (!userPrompt.trim()) throw new Error("大模型任务缺少 userPrompt");

      // 1) 解析 inputMapping：将用户定义的变量名映射为上游实际值
      //    例如 {key: "myQuestion", value: "开始.question"} → ctx.data.myQuestion = ctx.data["开始"]["question"]
      if (Array.isArray(inputMapping) && inputMapping.length > 0) {
        for (const mapping of inputMapping) {
          const varName = mapping.key?.trim();
          const sourcePath = mapping.value?.trim();
          if (!varName || !sourcePath) continue;

          let resolved: any = undefined;

          // 特殊值：data → 整个上下文, lastResult → 紧前输出
          if (sourcePath === "data") {
            resolved = ctx.data;
          } else if (sourcePath === "lastResult") {
            resolved = ctx.lastResult;
          } else {
            // 按路径取值: "HTTP请求1.body" → ctx.data["HTTP请求1"]["body"]
            const parts = sourcePath.split(".");
            let value: any = ctx.data;
            for (const p of parts) {
              if (value == null) break;
              value = value[p];
            }
            // 兜底：从 nodeOutputs 查找
            if ((value === undefined || value === null) && parts.length >= 1) {
              value = ctx.nodeOutputs[sourcePath];
            }
            resolved = value;
          }

          // 将解析后的值注入 ctx.data，下游 prompt 中 {{varName}} 即可引用
          ctx.data[varName] = resolved;
        }
      }

      // 2) 插值替换 {{xxx}} 占位符
      // 支持: {{data}} → 完整上下文, {{lastResult}} → 紧前输出,
      //       {{变量名}} → inputMapping 定义的变量, {{节点.字段}} → 直接引用
      const interpolate = (template: string) =>
        template.replace(/\{\{(.+?)\}\}/g, (_m: string, path: string) => {
          const trimmed = path.trim();

          // {{data}} → 整个上下文
          if (trimmed === "data") return JSON.stringify(ctx.data, null, 2);

          // {{lastResult}} → 紧前节点的输出
          if (trimmed === "lastResult") {
            const lr = ctx.lastResult;
            if (lr === undefined || lr === null) return "";
            return typeof lr === "string" ? lr : JSON.stringify(lr);
          }

          // 1) 先按 label/key 从 ctx.data 取值
          const keys = trimmed.split(".");
          let value: any = ctx.data;
          for (const k of keys) {
            if (value == null) break;
            value = value[k];
          }

          // 2) 兜底：按节点 ID 从 nodeOutputs 取值
          if ((value === undefined || value === null) && keys.length === 1) {
            value = ctx.nodeOutputs[trimmed];
          }

          if (value === undefined || value === null) return "";
          return typeof value === "string" ? value : JSON.stringify(value);
        });

      const resolvedUserPrompt = interpolate(userPrompt);
      const resolvedSystemPrompt = systemPrompt ? interpolate(systemPrompt) : "";

      const messages: Array<{ role: string; content: string }> = [];
      if (resolvedSystemPrompt) {
        messages.push({ role: "system", content: resolvedSystemPrompt });
      }
      messages.push({ role: "user", content: resolvedUserPrompt });

      // 通过 Vite 代理转发到后端执行，避免前端暴露 API Key
      const apiBase = "/api";
      const res = await fetch(`${apiBase}/llm/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          maxTokens,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`大模型调用失败 (${res.status}): ${errText}`);
      }

      const json = await res.json();
      const content = json.data?.content ?? "";
      const usage = json.data?.usage ?? {};

      // 将 AI 回复存入上下文，供下游节点使用
      ctx.data.llmResponse = content;
      ctx.data.llmUsage = usage;

      console.log(`[workflow:llm] AI 回复: ${content.slice(0, 200)}...`);
      return { content, model: json.data?.model, usage };
    }

    default:
      throw new Error(`未知任务类型: ${data.taskType}`);
  }
}

// ---------------------------------------------------------------------------
// Condition helpers
// ---------------------------------------------------------------------------

function evaluateCondition(
  value: unknown,
  operator: string,
  expected: string,
): boolean {
  const lhs = String(value ?? "");
  const rhs = expected;
  switch (operator) {
    case "==": return lhs == rhs;
    case "!=": return lhs != rhs;
    case ">": return Number(lhs) > Number(rhs);
    case "<": return Number(lhs) < Number(rhs);
    case ">=": return Number(lhs) >= Number(rhs);
    case "<=": return Number(lhs) <= Number(rhs);
    case "contains": return lhs.includes(rhs);
    case "startsWith": return lhs.startsWith(rhs);
    case "endsWith": return lhs.endsWith(rhs);
    default: return false;
  }
}

/** Evaluate a JS condition expression against data, matching the backend */
function evaluateConditionExpr(expression: string, data: any): boolean {
  if (!expression || expression.trim() === "") return true;
  try {
    const fn = new Function("data", `return !!(${expression})`);
    return Boolean(fn(data));
  } catch {
    return true;
  }
}

function resolveFieldValue(fieldPath: string, ctx: ExecutionContext): unknown {
  // Search through node outputs
  for (const [nodeId, output] of Object.entries(ctx.nodeOutputs)) {
    if (fieldPath.startsWith(nodeId)) {
      const rest = fieldPath.slice(nodeId.length).replace(/^\./, "");
      return rest ? deepGet(output, rest) : output;
    }
  }
  let v = deepGet(ctx.input, fieldPath);
  if (v !== undefined) return v;
  return deepGet(ctx.lastResult, fieldPath);
}

function deepGet(obj: unknown, path: string): unknown {
  if (obj == null) return undefined;
  const parts = path.split(".");
  let current: any = obj;
  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = current[p];
  }
  return current;
}

// ---------------------------------------------------------------------------
// DFS for condition branching
// ---------------------------------------------------------------------------

function markSubtree(
  root: string,
  successors: Map<string, string[]>,
  skipped: Set<string>,
) {
  if (skipped.has(root)) return;
  skipped.add(root);
  for (const c of successors.get(root) ?? []) {
    markSubtree(c, successors, skipped);
  }
}

function unmarkSubtree(
  root: string,
  successors: Map<string, string[]>,
  skipped: Set<string>,
) {
  if (!skipped.has(root)) return;
  skipped.delete(root);
  for (const c of successors.get(root) ?? []) {
    unmarkSubtree(c, successors, skipped);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
