import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { WorkflowNodeData } from '../../types/workflow'

/**
 * StartNode — 工作流入口
 *
 * 只暴露一个 source handle（底部），因为这个节点只能"出去"，
 * 不能有连线"进来"。
 */
function StartNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData

  return (
    <div
      className={`
        relative min-w-[140px] rounded-full px-6 py-3 text-center text-sm font-semibold
        bg-green-500 text-white shadow-md select-none
        transition-shadow duration-150
        ${selected ? 'ring-2 ring-green-300 ring-offset-2 shadow-lg' : 'hover:shadow-lg'}
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span>🚀</span>
        <span>{nodeData.label}</span>
      </div>

      {/* 底部的 source handle — 连线从这里拖出 */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-600 !border-2 !border-white !w-3 !h-3"
      />
    </div>
  )
}

export default memo(StartNode)
