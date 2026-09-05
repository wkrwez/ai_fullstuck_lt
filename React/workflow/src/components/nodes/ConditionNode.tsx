import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/workflow'

/**
 * EndNode — 工作流终点
 *
 * 只有 target handle（上方），因为流程到这里结束，不再有后续节点。
 */
function EndNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData

  return (
    <div
      className={`
        relative min-w-[140px] rounded-full px-6 py-3 text-center text-sm font-semibold
        bg-red-500 text-white shadow-md select-none
        transition-shadow duration-150
        ${selected ? 'ring-2 ring-red-300 ring-offset-2 shadow-lg' : 'hover:shadow-lg'}
      `}
    >
      {/* ---- target handle（上方）---- */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-red-600 !border-2 !border-white !w-3 !h-3"
      />

      <div className="flex items-center justify-center gap-1.5">
        <span>🏁</span>
        <span>{nodeData.label}</span>
      </div>
    </div>
  )
}

export default memo(EndNode)
