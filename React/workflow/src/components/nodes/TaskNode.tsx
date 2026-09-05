import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/workflow'
import { TASK_TYPES } from '../../types/workflow'

/**
 * TaskNode — 工作流中的核心任务节点。
 *
 * 有 target（上方），source（下方）。
 * 支持执行状态显示：idle / running / completed / error。
 */
function TaskNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData
  const taskMeta = TASK_TYPES.find((t) => t.type === nodeData.taskType)
  const status = nodeData.status

  // Status ring color
  const statusRing =
    status === 'running'
      ? 'ring-2 ring-blue-400 ring-offset-2'
      : status === 'completed'
        ? 'ring-2 ring-green-400 ring-offset-2'
        : status === 'error'
          ? 'ring-2 ring-red-400 ring-offset-2'
          : selected
            ? 'ring-2 ring-blue-300 ring-offset-2'
            : ''

  return (
    <div
      className={`
        relative min-w-[180px] rounded-lg border-2 bg-white px-4 py-3 text-sm shadow-sm
        select-none transition-all duration-200
        ${statusRing}
        ${selected ? 'shadow-lg' : status === 'running' ? 'shadow-md animate-pulse' : 'hover:shadow-md'}
      `}
      style={{ borderColor: status === 'error' ? '#ef4444' : status === 'completed' ? '#22c55e' : taskMeta?.color ?? '#3b82f6' }}
    >
      {/* ---- target handle（上方）---- */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />

      {/* ---- Status dot ---- */}
      {status && status !== 'idle' && (
        <span
          className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full
                     text-[10px] shadow-sm"
          title={status}
        >
          {status === 'running' && <span className="animate-spin text-blue-500">⏳</span>}
          {status === 'completed' && <span className="text-green-500">✓</span>}
          {status === 'error' && <span className="text-red-500">✕</span>}
        </span>
      )}

      {/* ---- 节点头部 ---- */}
      <div className="flex items-center gap-2 mb-1.5">
        {taskMeta ? (
          <span
            className="flex size-6 items-center justify-center rounded text-xs"
            style={{ backgroundColor: taskMeta.color + '20', color: taskMeta.color }}
          >
            {taskMeta.icon}
          </span>
        ) : (
          <span className="flex size-6 items-center justify-center rounded bg-gray-100 text-xs text-gray-500">
            📋
          </span>
        )}
        <span className="font-semibold text-gray-800 truncate">{nodeData.label}</span>
      </div>

      {/* ---- 任务类型标签 ---- */}
      {taskMeta && (
        <span
          className="inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ backgroundColor: taskMeta.color + '15', color: taskMeta.color }}
        >
          {taskMeta.label}
        </span>
      )}

      {/* ---- Error message ---- */}
      {status === 'error' && nodeData.errorMessage && (
        <p className="mt-1.5 text-[11px] text-red-500 truncate max-w-[160px]">
          {nodeData.errorMessage}
        </p>
      )}

      {/* ---- source handle（下方）---- */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !border-2 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(TaskNode)
