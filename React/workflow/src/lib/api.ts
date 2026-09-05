import type { WorkflowDocument, WorkflowListItem } from "../types/workflow";

// Vite proxies /api → localhost:3001, so we use relative URLs
const BASE = "/api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** All API responses are wrapped: { success: boolean, data: T } */
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API ${options.method ?? "GET"} ${path} failed (${res.status}): ${text}`,
    );
  }
  if (res.status === 204) return undefined as T;
  const json: ApiResponse<T> = await res.json();
  return json.data;
}

// ---------------------------------------------------------------------------
// Workflow CRUD
// ---------------------------------------------------------------------------

export function listWorkflows(): Promise<WorkflowListItem[]> {
  return request<WorkflowListItem[]>("/workflows");
}

export function getWorkflow(id: string): Promise<WorkflowDocument> {
  return request<WorkflowDocument>(`/workflows/${id}`);
}

export function saveWorkflow(data: {
  name?: string;
  nodes?: any[];
  edges?: any[];
  id?: string;
}): Promise<WorkflowDocument> {
  if (data.id) {
    return request<WorkflowDocument>(`/workflows/${data.id}`, {
      method: "PUT",
      body: JSON.stringify({ name: data.name, nodes: data.nodes, edges: data.edges }),
    });
  }
  return request<WorkflowDocument>("/workflows", {
    method: "POST",
    body: JSON.stringify({ name: data.name, nodes: data.nodes, edges: data.edges }),
  });
}

export function deleteWorkflow(id: string): Promise<null> {
  return request<null>(`/workflows/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

export interface ExecutionResult {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "running" | "completed" | "failed";
  nodeResults: Record<
    string,
    {
      status: string;
      output: unknown;
      error: string | null;
      startedAt?: string;
      finishedAt?: string;
    }
  >;
  logs: { timestamp: string; level: string; message: string }[];
  error: string | null;
  startedAt: string;
  finishedAt: string | null;
}

export interface ExecutionListItem {
  id: string;
  workflowId: string;
  workflowName: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
}

/** Kick off a server-side workflow execution. Returns the execution ID. */
export function executeWorkflow(workflowId: string): Promise<{ executionId: string }> {
  return request<{ executionId: string }>(`/workflows/${workflowId}/execute`, {
    method: "POST",
  });
}

/** Poll for execution status & results */
export function getExecution(id: string): Promise<ExecutionResult> {
  return request<ExecutionResult>(`/executions/${id}`);
}

/** List all past executions */
export function listExecutions(): Promise<ExecutionListItem[]> {
  return request<ExecutionListItem[]>("/executions");
}
