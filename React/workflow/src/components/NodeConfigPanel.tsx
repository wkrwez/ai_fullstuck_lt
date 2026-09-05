import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { useWorkflowStore } from "../store/workflowStore";
import type {
  WorkflowNodeData,
  KeyValuePair,
  HttpMethod,
  WorkflowNode,
  WorkflowEdge,
} from "../types/workflow";
import {
  TASK_TYPES,
  NODE_TYPE_LABELS,
  CONDITION_OPERATORS,
  HTTP_METHODS,
} from "../types/workflow";

/**
 * NodeConfigPanel — 右侧配置面板
 *
 * 当选中节点时从右侧滑入，展示该节点类型对应的配置表单。
 * 修改即时写入 store（updateNodeData）。
 */
export default function NodeConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);
  const removeNode = useWorkflowStore((s) => s.removeNode);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);

  const node = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  // 计算当前节点的所有上游节点（沿连线反向追溯）
  const upstreamNodes = useMemo<WorkflowNode[]>(() => {
    if (!selectedNodeId) return [];
    return getUpstreamNodes(selectedNodeId, nodes, edges);
  }, [selectedNodeId, nodes, edges]);

  const handleClose = useCallback(
    () => setSelectedNodeId(null),
    [setSelectedNodeId],
  );
  const handleDelete = useCallback(() => {
    if (!node) return;
    removeNode(node.id);
  }, [node, removeNode]);

  if (!node) return null;

  const data = node.data as WorkflowNodeData;

  const update = (partial: Partial<WorkflowNodeData>) =>
    updateNodeData(node.id, partial);

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l border-gray-200 bg-white overflow-hidden">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">
            {NODE_TYPE_LABELS[node.type!]} 配置
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{node.id}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="删除节点"
          >
            🗑
          </button>
          <button
            onClick={handleClose}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="关闭"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ---- Body (scrollable) ---- */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {/* === Common: Label === */}
        <FieldGroup label="节点名称">
          <input
            type="text"
            value={data.label ?? ""}
            onChange={(e) => update({ label: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </FieldGroup>

        {/* === Start Node === */}
        {node.type === "start" && (
          <StartConfig
            data={data}
            update={update}
          />
        )}

        {/* === Task Node === */}
        {node.type === "task" && (
          <TaskConfig
            data={data}
            update={update}
            upstreamNodes={upstreamNodes}
          />
        )}

        {/* === Condition Node === */}
        {node.type === "condition" && (
          <ConditionConfig
            data={data}
            update={update}
          />
        )}

        {/* === End Node === */}
        {node.type === "end" && <EndConfig data={data} />}

        {/* === Execution Status === */}
        {data.status && data.status !== "idle" && (
          <div className="rounded-lg border p-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">执行状态</p>
            <StatusBadge status={data.status} />
            {data.lastOutput !== undefined && data.lastOutput !== null && (
              <pre className="mt-2 max-h-32 overflow-auto rounded bg-gray-50 p-2 text-[11px] text-gray-600">
                {typeof data.lastOutput === "string"
                  ? data.lastOutput
                  : JSON.stringify(data.lastOutput, null, 2)}
              </pre>
            )}
            {data.errorMessage && (
              <p className="mt-1 text-xs text-red-500">{data.errorMessage}</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Sub-components per node type
// ---------------------------------------------------------------------------

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    running: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    idle: "bg-gray-100 text-gray-500",
  };
  const labels: Record<string, string> = {
    running: "执行中…",
    completed: "已完成",
    error: "出错",
    idle: "空闲",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${map[status] ?? map.idle}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

// ─── Start ────────────────────────────────────────────────────────────────

function StartConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const params = data.startConfig?.inputParams ?? [];

  const setParams = (items: KeyValuePair[]) =>
    update({ startConfig: { inputParams: items } });

  return (
    <FieldGroup label="输入参数">
      <KeyValueEditor
        items={params}
        onChange={setParams}
      />
      <p className="text-[10px] text-gray-400 mt-1">
        这些参数将作为工作流的初始输入数据
      </p>
    </FieldGroup>
  );
}

// ─── Task ─────────────────────────────────────────────────────────────────

function TaskConfig({
  data,
  update,
  upstreamNodes,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
  upstreamNodes: WorkflowNode[];
}) {
  return (
    <>
      {/* Task type selector */}
      <FieldGroup label="任务类型">
        <select
          value={data.taskType ?? "log"}
          onChange={(e) =>
            update({
              taskType: e.target.value as WorkflowNodeData["taskType"],
              config: {}, // reset config when switching type
            })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        >
          {TASK_TYPES.map((t) => (
            <option
              key={t.type}
              value={t.type}
            >
              {t.icon} {t.label}
            </option>
          ))}
        </select>
      </FieldGroup>

      {/* Per-type config */}
      {data.taskType === "http-request" && (
        <HttpRequestConfig
          data={data}
          update={update}
        />
      )}
      {data.taskType === "transform" && (
        <TransformConfig
          data={data}
          update={update}
        />
      )}
      {data.taskType === "delay" && (
        <DelayConfig
          data={data}
          update={update}
        />
      )}
      {data.taskType === "log" && (
        <LogConfig
          data={data}
          update={update}
        />
      )}
      {data.taskType === "script" && (
        <ScriptConfig
          data={data}
          update={update}
        />
      )}
      {data.taskType === "llm" && (
        <LLMConfig
          data={data}
          update={update}
          upstreamNodes={upstreamNodes}
        />
      )}
    </>
  );
}

// ─── HTTP Request ─────────────────────────────────────────────────────────

function HttpRequestConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  return (
    <>
      <div className="flex gap-2">
        <div className="w-24">
          <FieldGroup label="Method">
            <select
              value={config.method ?? "GET"}
              onChange={(e) => set("method", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none"
            >
              {HTTP_METHODS.map((m) => (
                <option
                  key={m}
                  value={m}
                >
                  {m}
                </option>
              ))}
            </select>
          </FieldGroup>
        </div>
        <div className="flex-1">
          <FieldGroup label="URL">
            <input
              type="text"
              value={config.url ?? ""}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://api.example.com/data"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </FieldGroup>
        </div>
      </div>

      <FieldGroup label="Headers">
        <KeyValueEditor
          items={config.headers ?? []}
          onChange={(items) => set("headers", items)}
        />
      </FieldGroup>

      <FieldGroup label="Body (JSON)">
        <textarea
          value={config.body ?? ""}
          onChange={(e) => set("body", e.target.value)}
          rows={4}
          placeholder='{"key": "value"}'
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
      </FieldGroup>
    </>
  );
}

// ─── Transform ────────────────────────────────────────────────────────────

function TransformConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  return (
    <>
      <FieldGroup label="操作类型">
        <select
          value={config.operation ?? "set"}
          onChange={(e) => set("operation", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none"
        >
          <option value="set">set — 设置字段</option>
          <option value="pick">pick — 提取字段</option>
          <option value="map">map — 自定义映射</option>
        </select>
      </FieldGroup>

      {(config.operation === "set" || !config.operation) && (
        <>
          <FieldGroup label="字段名 (key)">
            <input
              type="text"
              value={config.key ?? ""}
              onChange={(e) => set("key", e.target.value)}
              placeholder="result"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </FieldGroup>
          <FieldGroup label="值 (value)">
            <input
              type="text"
              value={config.value ?? ""}
              onChange={(e) => set("value", e.target.value)}
              placeholder="hello world"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </FieldGroup>
        </>
      )}

      {config.operation === "pick" && (
        <FieldGroup label="提取字段 (逗号分隔)">
          <input
            type="text"
            value={Array.isArray(config.fields) ? config.fields.join(", ") : ""}
            onChange={(e) =>
              set(
                "fields",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder="name, email, age"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </FieldGroup>
      )}

      {config.operation === "map" && (
        <FieldGroup label="映射表达式 (JS)">
          <textarea
            value={config.expression ?? ""}
            onChange={(e) => set("expression", e.target.value)}
            rows={4}
            placeholder="({ ...data, fullName: data.first + ' ' + data.last })"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            data 是当前上下文数据，返回新对象替换整个上下文
          </p>
        </FieldGroup>
      )}
    </>
  );
}

// ─── Delay ────────────────────────────────────────────────────────────────

function DelayConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  return (
    <FieldGroup label="延迟时间（毫秒）">
      <input
        type="number"
        value={config.duration ?? 1000}
        onChange={(e) => set("duration", Number(e.target.value))}
        min={0}
        max={300000}
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                   focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
      />
      <p className="text-[10px] text-gray-400 mt-1">最大 300,000ms（5分钟）</p>
    </FieldGroup>
  );
}

// ─── Log ──────────────────────────────────────────────────────────────────

function LogConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  return (
    <>
      <FieldGroup label="日志级别">
        <select
          value={config.level ?? "info"}
          onChange={(e) => set("level", e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none"
        >
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
          <option value="debug">debug</option>
        </select>
      </FieldGroup>
      <FieldGroup label="消息模板">
        <textarea
          value={config.message ?? ""}
          onChange={(e) => set("message", e.target.value)}
          rows={3}
          placeholder="处理完成，结果: {{result}}"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
        <p className="text-[10px] text-gray-400 mt-1">
          使用 {"{{key}}"} 插值上下文中的数据
        </p>
      </FieldGroup>
    </>
  );
}

// ─── Script ───────────────────────────────────────────────────────────────

function ScriptConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  return (
    <FieldGroup label="脚本代码 (JavaScript)">
      <textarea
        value={config.code ?? ""}
        onChange={(e) => set("code", e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder={`// 可以访问 data（上下文数据）和 utils
const result = data.someField * 2;
return result;`}
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono
                   bg-gray-50 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
      />
      <p className="text-[10px] text-gray-400 mt-1">
        代码在 async IIFE 中运行。可用变量: data, utils (JSON, Math, Date 等)
      </p>
    </FieldGroup>
  );
}

// ─── LLM (大模型) ──────────────────────────────────────────────────────────

function LLMConfig({
  data,
  update,
  upstreamNodes,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
  upstreamNodes: WorkflowNode[];
}) {
  const config = data.config ?? {};
  const set = (k: string, v: any) => update({ config: { ...config, [k]: v } });

  // inputMapping: key=自定义变量名, value=上游字段路径
  const mapping = config.inputMapping ?? ([] as KeyValuePair[]);
  const setMapping = (items: KeyValuePair[]) => set("inputMapping", items);

  return (
    <>
      {/* ── 输入参数映射（和开始节点一样的键值对编辑器）── */}
      <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 space-y-2">
        <p className="text-xs font-semibold text-green-700">
          🔗 输入参数映射
          {upstreamNodes.length > 0 && (
            <span className="ml-1 font-normal text-gray-400">
              （沿连线追溯 {upstreamNodes.length} 个上游节点）
            </span>
          )}
        </p>
        <p className="text-[10px] text-gray-400">
          左边定义变量名（prompt 中用 {"{{变量名}}"}{" "}
          引用），右边点击选择沿连线可到达的上游节点字段。分叉路径上的节点不会出现。
        </p>

        {mapping.length === 0 && upstreamNodes.length === 0 && (
          <p className="text-[11px] text-gray-400 italic py-1">
            当前节点没有上游连线，无法选择输入参数。请先连接上游节点。
          </p>
        )}

        {mapping.length === 0 && upstreamNodes.length > 0 && (
          <p className="text-[11px] text-gray-400 italic py-1">
            点击下方"+ 添加"开始定义输入映射
          </p>
        )}

        <MappingEditor
          items={mapping}
          onChange={setMapping}
          upstreamNodes={upstreamNodes}
        />
      </div>

      <FieldGroup label="模型">
        <input
          type="text"
          value={config.model ?? "deepseek-chat"}
          onChange={(e) => set("model", e.target.value)}
          placeholder="deepseek-chat"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
        <p className="text-[10px] text-gray-400 mt-1">
          DeepSeek 模型: deepseek-chat / deepseek-reasoner
        </p>
      </FieldGroup>

      <FieldGroup label="System Prompt">
        <textarea
          id="llm-systemPrompt"
          value={config.systemPrompt ?? ""}
          onChange={(e) => set("systemPrompt", e.target.value)}
          rows={3}
          placeholder="你是一个有用的助手..."
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
      </FieldGroup>

      <FieldGroup label="User Prompt">
        <textarea
          id="llm-userPrompt"
          value={config.userPrompt ?? ""}
          onChange={(e) => set("userPrompt", e.target.value)}
          rows={5}
          placeholder={`根据以下数据生成分析报告：\n{{data}}`}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono
                     focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
      </FieldGroup>

      <div className="flex gap-2">
        <div className="flex-1">
          <FieldGroup label="Temperature">
            <input
              type="number"
              value={config.temperature ?? 0.7}
              onChange={(e) => set("temperature", Number(e.target.value))}
              min={0}
              max={2}
              step={0.1}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </FieldGroup>
        </div>
        <div className="flex-1">
          <FieldGroup label="Max Tokens">
            <input
              type="number"
              value={config.maxTokens ?? 2048}
              onChange={(e) => set("maxTokens", Number(e.target.value))}
              min={1}
              max={8192}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                         focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
            />
          </FieldGroup>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-1">
        API Key 从服务端环境变量 DEEPSEEK_API_KEY 读取，无需在节点中配置。
      </p>
    </>
  );
}

// ─── 输入映射编辑器 ───────────────────────────────────────────────────────

/** 级联菜单树节点 */
interface FieldTreeNode {
  label: string;
  path: string;
  children: FieldTreeNode[];
}

function MappingEditor({
  items,
  onChange,
  upstreamNodes,
}: {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
  upstreamNodes: WorkflowNode[];
}) {
  const add = () => onChange([...items, { key: "", value: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "key" | "value", val: string) =>
    onChange(
      items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  // 构建级联菜单树
  const nodeTree = useMemo(() => buildNodeTree(upstreamNodes), [upstreamNodes]);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex gap-1.5 items-start"
        >
          <input
            type="text"
            value={item.key}
            onChange={(e) => updateItem(i, "key", e.target.value)}
            placeholder="变量名"
            className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-xs
                       focus:border-blue-400 focus:outline-none font-mono"
          />
          <span className="text-xs text-gray-300 pt-1.5">=</span>
          <CascadingFieldSelect
            value={item.value}
            onChange={(val) => updateItem(i, "value", val)}
            nodeTree={nodeTree}
          />
          <button
            onClick={() => remove(i)}
            className="shrink-0 text-gray-300 hover:text-red-400 text-xs px-1 pt-1.5"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
      >
        + 添加
      </button>
    </div>
  );
}

// ─── 级联选择器 ───────────────────────────────────────────────────────────

function CascadingFieldSelect({
  value,
  onChange,
  nodeTree,
}: {
  value: string;
  onChange: (val: string) => void;
  nodeTree: FieldTreeNode[];
}) {
  const [open, setOpen] = useState(false);
  const [hoveredNodeIdx, setHoveredNodeIdx] = useState<number | null>(null);
  const [hoveredFieldIdx, setHoveredFieldIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        resetHover();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const resetHover = () => {
    setHoveredNodeIdx(null);
    setHoveredFieldIdx(null);
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleSelect = (path: string) => {
    onChange(path);
    setOpen(false);
    resetHover();
  };

  // 延迟悬停，避免快速划过时闪烁
  const delayedHover = (setter: () => void) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(setter, 150);
  };

  // 当前悬停节点的子字段
  const hoveredNode = hoveredNodeIdx !== null ? nodeTree[hoveredNodeIdx] : null;
  const hoveredField =
    hoveredNode && hoveredFieldIdx !== null
      ? hoveredNode.children[hoveredFieldIdx]
      : null;

  return (
    <div
      ref={containerRef}
      className="relative flex-1"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="点击选择上游输出，或手动输入嵌套路径"
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs font-mono
                   focus:border-blue-400 focus:outline-none bg-white"
      />

      {open && (
        <div className="absolute top-full left-0 mt-0.5 z-50 flex">
          {/* ── 第一层：节点名称 ── */}
          <div className="min-w-[180px] rounded-md border border-gray-200 bg-white shadow-lg py-0.5">
            <button
              type="button"
              onClick={() => handleSelect("data")}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
            >
              全部上下文 (data)
            </button>
            <button
              type="button"
              onClick={() => handleSelect("lastResult")}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 border-b border-gray-100"
            >
              紧前节点输出 (lastResult)
            </button>

            {nodeTree.map((node, idx) => (
              <div
                key={node.path}
                onMouseEnter={() =>
                  delayedHover(() => {
                    setHoveredNodeIdx(idx);
                    setHoveredFieldIdx(null);
                  })
                }
              >
                <button
                  type="button"
                  onClick={() => handleSelect(node.path)}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-700
                             hover:bg-blue-50 flex items-center justify-between"
                >
                  <span className="truncate">{node.label}</span>
                  {node.children.length > 0 && (
                    <span className="text-gray-300 ml-2 shrink-0">›</span>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* ── 第二层：该节点的输出字段（悬停时显示）── */}
          {hoveredNode && hoveredNode.children.length > 0 && (
            <div className="ml-0.5 min-w-[160px] rounded-md border border-gray-200 bg-white shadow-lg py-0.5">
              <p className="px-3 py-1 text-[10px] text-gray-400 font-semibold border-b border-gray-50">
                {hoveredNode.label} 的输出字段
              </p>
              {hoveredNode.children.map((field, idx) => (
                <div
                  key={field.path}
                  onMouseEnter={() =>
                    delayedHover(() => setHoveredFieldIdx(idx))
                  }
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(field.path)}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700
                               hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>{field.label}</span>
                    <span className="text-[10px] text-gray-400 font-mono ml-2">
                      .{field.path.split(".").pop()}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── 第三层：嵌套提示（悬停叶子字段时显示）── */}
          {hoveredField && hoveredField.children.length === 0 && (
            <div className="ml-0.5 min-w-[160px] rounded-md border border-gray-200 bg-white shadow-lg py-2 px-3">
              <p className="text-[10px] text-gray-400 mb-1">
                已选:{" "}
                <span className="font-mono text-gray-600">
                  {hoveredField.path}
                </span>
              </p>
              <p className="text-[10px] text-gray-400">
                如需访问嵌套属性，请点击选中后
                <br />
                在输入框中手动补充路径。
                <br />
                <span className="text-gray-500 font-mono">
                  例: {hoveredField.path}.data.items.name
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Condition ────────────────────────────────────────────────────────────

function ConditionConfig({
  data,
  update,
}: {
  data: WorkflowNodeData;
  update: (p: Partial<WorkflowNodeData>) => void;
}) {
  const cond = data.conditionConfig ?? { field: "", operator: "==", value: "" };
  const config = data.config ?? {};

  const setCond = (k: string, v: any) =>
    update({ conditionConfig: { ...cond, [k]: v } });

  const setExpr = (expr: string) =>
    update({ config: { ...config, expression: expr } });

  return (
    <>
      {/* Simple mode: field + operator + value */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
        <p className="text-xs font-semibold text-gray-500">简单条件</p>
        <FieldGroup label="字段路径">
          <input
            type="text"
            value={cond.field ?? ""}
            onChange={(e) => setCond("field", e.target.value)}
            placeholder="nodeId.field 或 lastResult.field"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </FieldGroup>
        <FieldGroup label="运算符">
          <select
            value={cond.operator ?? "=="}
            onChange={(e) => setCond("operator", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                       focus:border-blue-400 focus:outline-none"
          >
            {CONDITION_OPERATORS.map((op) => (
              <option
                key={op.value}
                value={op.value}
              >
                {op.label}
              </option>
            ))}
          </select>
        </FieldGroup>
        <FieldGroup label="比较值">
          <input
            type="text"
            value={cond.value ?? ""}
            onChange={(e) => setCond("value", e.target.value)}
            placeholder="期望值"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
        </FieldGroup>
      </div>

      {/* Advanced mode: raw JS expression (matching the backend) */}
      <div className="rounded-lg border border-dashed border-gray-300 p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-500">
          高级：JS 表达式{" "}
          <span className="text-gray-300">— 与后端执行引擎一致</span>
        </p>
        <FieldGroup label="表达式">
          <input
            type="text"
            value={config.expression ?? ""}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="data.status === 'ok' && data.count > 5"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono
                       focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            留空则走 true 分支。变量: data（整个上下文数据对象）
          </p>
        </FieldGroup>
      </div>
    </>
  );
}

// ─── End ──────────────────────────────────────────────────────────────────

function EndConfig({ data }: { data: WorkflowNodeData }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      <p className="text-xs text-gray-400">
        结束节点无需额外配置。当执行到达此节点时工作流完成。
      </p>
    </div>
  );
}

// ─── Reusable Key-Value Editor ────────────────────────────────────────────

function KeyValueEditor({
  items,
  onChange,
}: {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
}) {
  const add = () => onChange([...items, { key: "", value: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: "key" | "value", val: string) =>
    onChange(
      items.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
    );

  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex gap-1.5 items-center"
        >
          <input
            type="text"
            value={item.key}
            onChange={(e) => updateItem(i, "key", e.target.value)}
            placeholder="key"
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs
                       focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => updateItem(i, "value", e.target.value)}
            placeholder="value"
            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-xs
                       focus:border-blue-400 focus:outline-none"
          />
          <button
            onClick={() => remove(i)}
            className="shrink-0 text-gray-300 hover:text-red-400 text-xs px-1"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="text-xs text-blue-500 hover:text-blue-600 font-medium"
      >
        + 添加
      </button>
    </div>
  );
}

// ─── 图算法：获取上游节点 ────────────────────────────────────────────────

/**
 * 沿连线反向追溯，获取当前节点的所有上游节点（按拓扑序排列）。
 * 结果不包含当前节点自身。
 */
function getUpstreamNodes(
  nodeId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): WorkflowNode[] {
  const visited = new Set<string>();
  const result: WorkflowNode[] = [];

  function traverse(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    // 找所有 target === id 的边（即指向当前节点的上游边）
    const incoming = edges.filter((e) => e.target === id);
    for (const edge of incoming) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (sourceNode && !visited.has(sourceNode.id)) {
        result.push(sourceNode);
        traverse(sourceNode.id);
      }
    }
  }

  traverse(nodeId);
  return result;
}

// ─── 构建级联菜单树 ───────────────────────────────────────────────────────

/** 将上游节点列表转为级联菜单所需的树结构 */
function buildNodeTree(upstreamNodes: WorkflowNode[]): FieldTreeNode[] {
  return upstreamNodes.map((node) => {
    const nodeData = node.data as WorkflowNodeData;
    const label = nodeData.label || node.id;
    const fields = getNodeOutputFields(node);

    return {
      label,
      path: label,
      children: fields.map((f) => ({
        label: f.label,
        path: `${label}.${f.key}`,
        children: [], // 嵌套属性运行时才能确定，配置阶段不展开
      })),
    };
  });
}

/** 根据节点类型推测可选的输出字段 */
function getNodeOutputFields(
  node: WorkflowNode,
): Array<{ key: string; label: string }> {
  const data = node.data as WorkflowNodeData;

  if (node.type === "start") {
    const params = data.startConfig?.inputParams ?? [];
    return params
      .filter((p) => p.key)
      .map((p) => ({ key: p.key, label: p.key }));
  }

  switch (data.taskType) {
    case "http-request":
      return [
        { key: "status", label: "状态码" },
        { key: "body", label: "响应体" },
        { key: "elapsed", label: "耗时(ms)" },
      ];
    case "transform": {
      const op = data.config?.operation as string | undefined;
      if (op === "set" && data.config?.key) {
        return [
          { key: data.config.key as string, label: data.config.key as string },
        ];
      }
      if (op === "pick" && Array.isArray(data.config?.fields)) {
        return (data.config.fields as string[]).map((f) => ({
          key: f,
          label: f,
        }));
      }
      return [];
    }
    case "llm":
      return [
        { key: "content", label: "AI回复" },
        { key: "usage", label: "Token用量" },
      ];
    case "log":
      return [
        { key: "level", label: "日志级别" },
        { key: "message", label: "日志消息" },
      ];
    case "delay":
      return [{ key: "waited", label: "等待时长(ms)" }];
    default:
      return [];
  }
}
