import { create } from "zustand";
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import type {
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeType,
  WorkflowNodeData,
  WorkflowDocument,
  ExecutionStatus,
} from "../types/workflow";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let nodeIdCounter = 0;
export function nextId(prefix: string = "node"): string {
  return `${prefix}_${Date.now()}_${++nodeIdCounter}`;
}

/** Default layout for a newly-added node */
export function defaultData(type: WorkflowNodeType): WorkflowNodeData {
  const base: Record<WorkflowNodeType, WorkflowNodeData> = {
    start: { label: "开始", startConfig: { inputParams: [] } },
    task: { label: "新任务", taskType: "log", config: {} },
    condition: {
      label: "条件判断",
      conditionConfig: { field: "", operator: "==", value: "" },
    },
    end: { label: "结束" },
  };
  return base[type];
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  executionStatus: ExecutionStatus;
  workflowName: string;
  workflowId: string | null;

  // React Flow event handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Actions
  addNode: (
    type: WorkflowNodeType,
    position: { x: number; y: number },
  ) => string;
  removeNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  setSelectedNodeId: (id: string | null) => void;

  // Execution
  setExecutionStatus: (status: ExecutionStatus) => void;
  setNodeStatus: (
    id: string,
    status: WorkflowNodeData["status"],
    extra?: { lastOutput?: unknown; errorMessage?: string },
  ) => void;
  resetAllNodeStatuses: () => void;

  // Persistence
  setWorkflowName: (name: string) => void;
  loadWorkflow: (doc: WorkflowDocument) => void;
  clearCanvas: () => void;
}

/** Initial canvas state */
const initialNodes: WorkflowNode[] = [
  {
    id: nextId("start"),
    type: "start",
    position: { x: 400, y: 50 },
    data: { label: "开始", startConfig: { inputParams: [] } },
  },
];

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  selectedNodeId: null,
  executionStatus: "idle",
  workflowName: "未命名工作流",
  workflowId: null,

  // ---- React Flow glue ----
  onNodesChange(changes) {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] });
  },
  onEdgesChange(changes) {
    set({ edges: applyEdgeChanges(changes, get().edges) as WorkflowEdge[] });
  },
  onConnect(connection) {
    set({ edges: addEdge(connection, get().edges) as WorkflowEdge[] });
  },

  // ---- Actions ----
  addNode(type, position) {
    const id = nextId(type);
    const newNode: WorkflowNode = {
      id,
      type,
      position,
      data: defaultData(type),
    };
    set({ nodes: [...get().nodes, newNode] });
    return id;
  },

  removeNode(id) {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  updateNodeData(id, partial) {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...partial } } : n,
      ),
    });
  },

  setSelectedNodeId(id) {
    set({ selectedNodeId: id });
  },

  // ---- Execution ----
  setExecutionStatus(status) {
    set({ executionStatus: status });
  },

  setNodeStatus(id, status, extra) {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                status,
                ...(extra?.lastOutput !== undefined
                  ? { lastOutput: extra.lastOutput }
                  : {}),
                ...(extra?.errorMessage !== undefined
                  ? { errorMessage: extra.errorMessage }
                  : {}),
              },
            }
          : n,
      ),
    });
  },

  resetAllNodeStatuses() {
    set({
      nodes: get().nodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "idle", lastOutput: undefined, errorMessage: undefined },
      })),
    });
  },

  // ---- Persistence ----
  setWorkflowName(name) {
    set({ workflowName: name });
  },

  loadWorkflow(doc) {
    set({
      nodes: doc.nodes,
      edges: doc.edges,
      workflowName: doc.name,
      workflowId: doc.id,
      selectedNodeId: null,
      executionStatus: "idle",
    });
  },

  clearCanvas() {
    set({
      nodes: initialNodes,
      edges: [],
      selectedNodeId: null,
      executionStatus: "idle",
      workflowName: "未命名工作流",
      workflowId: null,
    });
    nodeIdCounter = 0;
  },
}));
