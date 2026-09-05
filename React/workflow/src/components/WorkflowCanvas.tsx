import { useCallback, useRef, type DragEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes";
import { useWorkflowStore } from "../store/workflowStore";
import type { WorkflowNodeType } from "../types/workflow";

// 提取到组件外部，避免每次渲染创建新函数引用
const miniMapNodeColor = (node: any) => {
  switch (node.type) {
    case "start":
      return "#22c55e";
    case "end":
      return "#ef4444";
    case "condition":
      return "#f59e0b";
    default:
      return "#3b82f6";
  }
};

/**
 * WorkflowCanvas — 主画布
 *
 * 接收 React Flow 的所有事件（节点变化、连线变化、连接），
 * 并处理从 Sidebar 拖入的节点放置逻辑。
 */
export default function WorkflowCanvas() {
  // ---- store ----
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNodeId = useWorkflowStore((s) => s.setSelectedNodeId);

  // ---- ReactFlow 实例引用，用于 drop 时做坐标转换 ----
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);

  // ---- 拖入节点 ----
  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();

      const raw = e.dataTransfer.getData("application/reactflow");
      if (!raw) return;

      let payload: { nodeType: WorkflowNodeType; taskType?: string };
      try {
        payload = JSON.parse(raw);
      } catch {
        return;
      }

      // 将浏览器坐标转换为画布坐标
      const instance = reactFlowRef.current;
      if (!instance) return;

      const position = instance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const id = addNode(payload.nodeType, position);

      // 如果拖入的是带具体 taskType 的 task 节点，写入 data
      if (payload.taskType) {
        useWorkflowStore.getState().updateNodeData(id, {
          taskType: payload.taskType as any,
        });
      }
    },
    [addNode],
  );

  // ---- 清理选区 ----
  const onPaneClick = useCallback(
    () => setSelectedNodeId(null),
    [setSelectedNodeId],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => setSelectedNodeId(node.id),
    [setSelectedNodeId],
  );

  // ---- 连接校验：相同 handle 不连，重复边不连 ----
  const isValidConnection = useCallback(
    (connection: any) => {
      if (connection.source === connection.target) return false;
      const exists = edges.some(
        (e) =>
          e.source === connection.source &&
          e.target === connection.target &&
          e.sourceHandle === connection.sourceHandle &&
          e.targetHandle === connection.targetHandle,
      );
      return !exists;
    },
    [edges],
  );

  return (
    <div className="h-full w-full flex-1">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowRef.current = instance as ReactFlowInstance;
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
        multiSelectionKeyCode={"Shift"}
        onlyRenderVisibleElements={true}
      >
        {/* 网格背景 */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="red"
        />

        {/* 缩放控件（左下角） */}
        <Controls
          position="bottom-left"
          className="!rounded-lg !border !border-gray-200 !shadow-sm"
        />

        {/* 小地图（右下角） — 节点过多时自动隐藏，避免渲染 10000 个 SVG 色块 */}
        {nodes.length <= 500 && (
          <MiniMap
            position="bottom-right"
            nodeColor={miniMapNodeColor}
            maskColor="rgba(0,0,0,0.08)"
            className="!rounded-lg !border !border-gray-200 !shadow-sm"
          />
        )}
      </ReactFlow>
    </div>
  );
}
