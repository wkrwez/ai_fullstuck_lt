import type { Node, Edge } from '@xyflow/react'

/** Supported node types in the workflow */
export type WorkflowNodeType = 'start' | 'task' | 'condition' | 'end'

/** HTTP method */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** Condition operators */
export type ConditionOp = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'startsWith' | 'endsWith'

/** Key-value pair */
export interface KeyValuePair {
  key: string
  value: string
}

/**
 * Per-task-type configuration stored inside WorkflowNodeData.config.
 * Each task type exposes only the fields relevant to it.
 */
export interface TaskConfig {
  // --- http-request ---
  url?: string
  method?: HttpMethod
  headers?: KeyValuePair[]
  body?: string

  // --- transform ---
  expression?: string

  // --- delay ---
  delayMs?: number

  // --- log ---
  message?: string

  // --- script ---
  scriptCode?: string

  // --- llm (大模型) ---
  model?: string
  apiKey?: string
  systemPrompt?: string
  userPrompt?: string
  temperature?: number
  maxTokens?: number
  /** 输入映射: key=自定义变量名, value=上游字段路径(如 "HTTP请求1.body") */
  inputMapping?: KeyValuePair[]
}

/** Condition node specific config */
export interface ConditionConfig {
  field: string
  operator: ConditionOp
  value: string
  trueLabel?: string
  falseLabel?: string
}

/** Start node specific config */
export interface StartConfig {
  inputParams?: KeyValuePair[]
}

/** Data payload for each workflow node */
export interface WorkflowNodeData extends Record<string, unknown> {
  label: string
  /** What kind of task this node performs */
  taskType?: 'http-request' | 'transform' | 'delay' | 'log' | 'script' | 'llm'
  /** Task-level config */
  config?: TaskConfig
  /** Condition node config */
  conditionConfig?: ConditionConfig
  /** Start node config */
  startConfig?: StartConfig
  /** Execution status */
  status?: 'idle' | 'running' | 'completed' | 'error'
  /** Last execution output (shown in config panel after run) */
  lastOutput?: unknown
  /** Error message if status is 'error' */
  errorMessage?: string
}

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>
export type WorkflowEdge = Edge

/** Execution context — accumulated data passed between nodes */
export interface ExecutionContext {
  /** Mutable data accumulator (matches backend ctx.data) — nodes read/write this */
  data: Record<string, unknown>
  /** Input params from the start node (also merged into data) */
  input: Record<string, unknown>
  /** Outputs from each executed node, keyed by node id */
  nodeOutputs: Record<string, unknown>
  /** The result of the most recently executed node */
  lastResult: unknown
}

/** A saved workflow document */
export interface WorkflowDocument {
  id: string
  name: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
}

/** List of saved workflows (lightweight, no node/edge data) */
export interface WorkflowListItem {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

/** Execution state */
export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed'

/** Supported task type metadata */
export interface TaskTypeInfo {
  type: NonNullable<WorkflowNodeData['taskType']>
  label: string
  color: string
  icon: string
}

export const TASK_TYPES: TaskTypeInfo[] = [
  { type: 'http-request', label: 'HTTP 请求', color: '#3b82f6', icon: '🌐' },
  { type: 'transform', label: '数据转换', color: '#8b5cf6', icon: '🔄' },
  { type: 'delay', label: '延时等待', color: '#f59e0b', icon: '⏱️' },
  { type: 'log', label: '日志输出', color: '#6b7280', icon: '📝' },
  { type: 'script', label: '自定义脚本', color: '#ec4899', icon: '⚡' },
  { type: 'llm', label: '大模型', color: '#10b981', icon: '🤖' },
]

export const NODE_TYPE_LABELS: Record<WorkflowNodeType, string> = {
  start: '开始',
  task: '任务',
  condition: '条件',
  end: '结束',
}

export const CONDITION_OPERATORS: { value: ConditionOp; label: string }[] = [
  { value: '==', label: '等于 (==)' },
  { value: '!=', label: '不等于 (!=)' },
  { value: '>', label: '大于 (>)' },
  { value: '<', label: '小于 (<)' },
  { value: '>=', label: '大于等于 (>=)' },
  { value: '<=', label: '小于等于 (<=)' },
  { value: 'contains', label: '包含 (contains)' },
  { value: 'startsWith', label: '开头是 (startsWith)' },
  { value: 'endsWith', label: '结尾是 (endsWith)' },
]

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE']
