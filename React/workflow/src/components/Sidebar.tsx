import { type DragEvent } from 'react'
import type { WorkflowNodeType } from '../types/workflow'
import { NODE_TYPE_LABELS, TASK_TYPES } from '../types/workflow'

/**
 * Sidebar — 左侧节点面板
 *
 * 每个节点类型都是一个可拖拽的卡片。拖拽时把 `workflowNodeType` 写入
 * `dataTransfer`，WorkflowCanvas 在 drop 事件里读取并创建节点。
 */

interface NodeTemplate {
  type: WorkflowNodeType | 'task-variant'
  label: string
  color: string
  icon: string
  /** 只有 task-variant 会传具体 taskType */
  taskType?: string
}

const NODE_TEMPLATES: NodeTemplate[] = [
  { type: 'start', label: '开始节点', color: '#22c55e', icon: '🚀' },
  { type: 'end', label: '结束节点', color: '#ef4444', icon: '🏁' },
  { type: 'condition', label: '条件分支', color: '#f59e0b', icon: '🔀' },
  // 基础 task 节点
  { type: 'task', label: '空白任务', color: '#6b7280', icon: '📋' },
  // 每种 taskType 一个快捷入口
  ...TASK_TYPES.map(
    (t): NodeTemplate => ({
      type: 'task-variant' as const,
      label: t.label,
      color: t.color,
      icon: t.icon,
      taskType: t.type,
    }),
  ),
]

/** 拖拽开始时把 JSON 塞进 dataTransfer */
function onDragStart(e: DragEvent, template: NodeTemplate) {
  const payload =
    template.type === 'task-variant'
      ? { nodeType: 'task' as WorkflowNodeType, taskType: template.taskType }
      : { nodeType: template.type as WorkflowNodeType }

  e.dataTransfer.setData('application/reactflow', JSON.stringify(payload))
  e.dataTransfer.effectAllowed = 'move'
}

export default function Sidebar() {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
      {/* ---- 标题 ---- */}
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-bold text-gray-700">📦 节点面板</h2>
        <p className="mt-0.5 text-[11px] leading-tight text-gray-400">
          拖拽节点到画布中
        </p>
      </div>

      {/* ---- 可拖拽节点列表 ---- */}
      <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-2">
        {/* 分组：流程控制 */}
        <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          流程控制
        </p>
        {NODE_TEMPLATES.filter((t) => t.type !== 'task-variant').map((t) => (
          <DraggableCard key={t.type} template={t} onDragStart={onDragStart} />
        ))}

        {/* 分组：任务动作 */}
        <p className="mb-1.5 mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          任务动作
        </p>
        {NODE_TEMPLATES.filter((t) => t.type === 'task-variant').map((t, i) => (
          <DraggableCard key={`task-${i}`} template={t} onDragStart={onDragStart} />
        ))}
      </div>
    </aside>
  )
}

// ─── 可拖拽的单个卡片 ────────────────────────────────────────

function DraggableCard({
  template,
  onDragStart,
}: {
  template: NodeTemplate
  onDragStart: (e: DragEvent, t: NodeTemplate) => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      className="mb-1.5 flex cursor-grab items-center gap-2 rounded-lg border border-gray-200
                 bg-white px-3 py-2 text-sm shadow-sm transition-all
                 hover:border-gray-300 hover:shadow active:cursor-grabbing active:shadow-inner"
    >
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-xs"
        style={{ backgroundColor: template.color + '18' }}
      >
        {template.icon}
      </span>
      <span className="truncate text-xs font-medium text-gray-700">
        {template.label}
      </span>
    </div>
  )
}
