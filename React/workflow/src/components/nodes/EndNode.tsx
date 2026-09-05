import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/workflow'

/**
 * ConditionNode — 条件分支节点
 *
 * 上方 target handle 接收连线，
 * 下方两个 source handle：左边是"满足条件"（true），右边是"不满足"（false）。
 */
function ConditionNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData

  return (
    <div
      className={`
        relative min-w-[160px] rotate-45 transform scale-75
        border-2 border-amber-400 bg-amber-50 rounded-lg px-4 py-3 text-sm
        shadow-sm select-none
      `}
      style={{ transform: 'rotate(0deg)' }}
    >
      {/* ---- target handle（上方）---- */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 !border-2 !border-white !w-3 !h-3"
      />

      <div
        className={`
          relative rounded-lg border-2 border-amber-400 bg-white px-4 py-3
          transition-shadow duration-150
          ${selected ? 'ring-2 ring-amber-300 ring-offset-2 shadow-lg' : 'hover:shadow-md'}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔀</span>
          <span className="font-semibold text-gray-800">{nodeData.label}</span>
        </div>
        <div className="mt-1.5 flex gap-2 text-[11px] text-gray-500">
          <span className="text-green-600">✔ 满足</span>
          <span className="text-red-400">✘ 不满足</span>
        </div>
      </div>

      {/* ---- source handle left = true ---- */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!bg-green-500 !border-2 !border-white !w-3 !h-3"
        style={{ left: '30%' }}
      />
      {/* ---- source handle right = false ---- */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!bg-red-400 !border-2 !border-white !w-3 !h-3"
        style={{ left: '70%' }}
      />
    </div>
  )
}

export default memo(ConditionNode)
