import { useState, useCallback, useEffect, useRef } from "react";
import { useWorkflowStore } from "../store/workflowStore";
import * as api from "../lib/api";
import {
  executeWorkflowServer,
  executeWorkflowClient,
} from "../lib/workflowEngine";
import type { WorkflowListItem, WorkflowNodeData } from "../types/workflow";

/**
 * WorkflowToolbar — 顶部操作栏
 *
 * 提供：运行、保存、加载、清空 以及工作流名称编辑。
 */
export default function WorkflowToolbar() {
  const workflowName = useWorkflowStore((s) => s.workflowName);
  const workflowId = useWorkflowStore((s) => s.workflowId);
  const executionStatus = useWorkflowStore((s) => s.executionStatus);
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const setWorkflowName = useWorkflowStore((s) => s.setWorkflowName);
  const setExecutionStatus = useWorkflowStore((s) => s.setExecutionStatus);
  const setNodeStatus = useWorkflowStore((s) => s.setNodeStatus);
  const resetAllNodeStatuses = useWorkflowStore((s) => s.resetAllNodeStatuses);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const clearCanvas = useWorkflowStore((s) => s.clearCanvas);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [showLoadList, setShowLoadList] = useState(false);
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // 运行时输入对话框
  const [showInputDialog, setShowInputDialog] = useState(false);
  const [runtimeInputs, setRuntimeInputs] = useState<Record<string, string>>({});

  const loadListRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showLoadList) return;
    const handler = (e: MouseEvent) => {
      if (loadListRef.current && !loadListRef.current.contains(e.target as Node)) {
        setShowLoadList(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLoadList]);

  /** 实际执行工作流 */
  const doExecute = useCallback(
    async (inputValues: Record<string, string>) => {
      setExecutionStatus("running");
      resetAllNodeStatuses();
      setSelectedNodeId(null);

      const callbacks = {
        onNodeStart: (id: string) => setNodeStatus(id, "running"),
        onNodeComplete: (id: string, output: unknown) =>
          setNodeStatus(id, "completed", { lastOutput: output }),
        onNodeError: (id: string, error: string) =>
          setNodeStatus(id, "error", { errorMessage: error }),
        animationDelay: 400,
      };

      try {
        await executeWorkflowClient(nodes, edges, callbacks, inputValues);
      } catch (err: any) {
        console.error("Workflow execution error:", err);
      } finally {
        setExecutionStatus("completed");
      }
    },
    [
      nodes,
      edges,
      setExecutionStatus,
      setNodeStatus,
      resetAllNodeStatuses,
      setSelectedNodeId,
    ],
  );

  // --- Run ---
  const handleRun = useCallback(async (skipDialog = false) => {
    if (executionStatus === "running") return;

    // 查找开始节点，检查是否有需要用户输入的参数
    const startNode = nodes.find((n) => n.type === "start");
    const startData = startNode?.data as WorkflowNodeData | undefined;
    const inputParams = startData?.startConfig?.inputParams ?? [];

    if (!skipDialog && inputParams.length > 0) {
      // 弹出输入对话框，预填初始值
      const initial: Record<string, string> = {};
      for (const p of inputParams) {
        if (p.key) initial[p.key] = p.value ?? "";
      }
      setRuntimeInputs(initial);
      setShowInputDialog(true);
      return; // 等待用户确认后再执行
    }

    // 直接执行（无输入参数或 skipDialog=true）
    await doExecute({});
  }, [
    executionStatus,
    nodes,
    doExecute,
  ]);

  // --- Save ---
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const doc = await api.saveWorkflow({
        id: workflowId ?? undefined,
        name: workflowName,
        nodes: nodes as any[],
        edges: edges as any[],
      });
      // Update store with the returned ID
      useWorkflowStore.setState({ workflowId: doc.id });
      setSaveMsg("✅ 已保存");
    } catch (err: any) {
      setSaveMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 2000);
    }
  }, [workflowId, workflowName, nodes, edges]);

  // --- Load list ---
  const handleOpenLoad = useCallback(async () => {
    setShowLoadList(!showLoadList);
    if (!showLoadList) {
      setLoadingList(true);
      try {
        const list = await api.listWorkflows();
        setWorkflows(list);
      } catch {
        setWorkflows([]);
      } finally {
        setLoadingList(false);
      }
    }
  }, [showLoadList]);

  const handleLoad = useCallback(
    async (id: string) => {
      try {
        const doc = await api.getWorkflow(id);
        loadWorkflow({
          id: doc.id,
          name: doc.name,
          nodes: doc.nodes,
          edges: doc.edges,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        });
        setShowLoadList(false);
      } catch (err: any) {
        alert("加载失败: " + err.message);
      }
    },
    [loadWorkflow],
  );

  // --- Clear ---
  const handleClear = useCallback(() => {
    if (confirm("确定要清空画布吗？未保存的修改将丢失。")) {
      clearCanvas();
    }
  }, [clearCanvas]);

  const isRunning = executionStatus === "running";

  return (
    <>
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      {/* Workflow name */}
      <input
        type="text"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        className="w-40 rounded-md border border-gray-200 px-2.5 py-1 text-sm font-medium text-gray-700
                   focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200"
      />

      <div className="flex-1" />

      {/* Status indicator */}
      {executionStatus !== "idle" && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            executionStatus === "running"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {executionStatus === "running" ? "⏳ 运行中…" : "✅ 完成"}
        </span>
      )}

      {/* Run */}
      <button
        onClick={handleRun}
        disabled={isRunning}
        className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-semibold transition-colors
          ${isRunning
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 active:bg-green-700"
          }`}
      >
        ▶ {isRunning ? "运行中…" : "运行"}
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-1.5 rounded-md bg-blue-500 px-3.5 py-1.5 text-sm font-semibold
                   text-white hover:bg-blue-600 active:bg-blue-700 transition-colors
                   disabled:opacity-50"
      >
        💾 {saving ? "保存中…" : "保存"}
      </button>
      {saveMsg && (
        <span className="text-xs text-gray-500 animate-pulse">{saveMsg}</span>
      )}

      {/* Load */}
      <div className="relative" ref={loadListRef}>
        <button
          onClick={handleOpenLoad}
          className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-1.5
                     text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          📂 加载
        </button>

        {showLoadList && (
          <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-lg border border-gray-200
                          bg-white shadow-lg max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase">已保存的工作流</p>
            </div>
            {loadingList ? (
              <p className="p-4 text-sm text-gray-400 text-center">加载中…</p>
            ) : workflows.length === 0 ? (
              <p className="p-4 text-sm text-gray-400 text-center">暂无保存的工作流</p>
            ) : (
              workflows.map((wf) => (
                <button
                  key={wf.id}
                  onClick={() => handleLoad(wf.id)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b
                             border-gray-50 last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-700 truncate">{wf.name}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(wf.updatedAt).toLocaleString("zh-CN")}
                  </p>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Clear */}
      <button
        onClick={handleClear}
        className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3.5 py-1.5
                   text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200
                   transition-colors"
      >
        🗑 清空
      </button>
    </div>

    {/* ─── 运行时输入对话框 ─── */}
    {showInputDialog && (
      <InputDialog
        inputs={runtimeInputs}
        onChange={setRuntimeInputs}
        onConfirm={() => {
          setShowInputDialog(false);
          doExecute(runtimeInputs);
        }}
        onCancel={() => setShowInputDialog(false)}
      />
    )}
    </>
  );
}

// ─── 输入对话框组件 ──────────────────────────────────────────────────────

function InputDialog({
  inputs,
  onChange,
  onConfirm,
  onCancel,
}: {
  inputs: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const keys = Object.keys(inputs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-800">⚡ 运行工作流</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              请输入开始节点的输入参数
            </p>
          </div>
          <button
            onClick={onCancel}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {keys.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              无需输入参数，点击确认开始执行
            </p>
          ) : (
            keys.map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  {key}
                </label>
                <textarea
                  value={inputs[key] ?? ""}
                  onChange={(e) =>
                    onChange({ ...inputs, [key]: e.target.value })
                  }
                  rows={3}
                  placeholder={`请输入 ${key} 的值…`}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm
                             focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-200
                             resize-y"
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium
                       text-gray-600 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-green-500 px-6 py-2 text-sm font-semibold text-white
                       hover:bg-green-600 active:bg-green-700 transition-colors"
          >
            ▶ 开始执行
          </button>
        </div>
      </div>
    </div>
  );
}
