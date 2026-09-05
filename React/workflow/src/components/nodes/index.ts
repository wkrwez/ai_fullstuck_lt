export { default as StartNode } from './StartNode'
export { default as TaskNode } from './TaskNode'
export { default as ConditionNode } from './ConditionNode'
export { default as EndNode } from './EndNode'

import type { WorkflowNodeType } from '../../types/workflow'
import StartNode from './StartNode'
import TaskNode from './TaskNode'
import ConditionNode from './ConditionNode'
import EndNode from './EndNode'

/** React Flow 要求的 nodeTypes 映射 —— 传给 <ReactFlow nodeTypes={...} /> */
export const nodeTypes: Record<WorkflowNodeType, React.ComponentType<any>> = {
  start: StartNode,
  task: TaskNode,
  condition: ConditionNode,
  end: EndNode,
}
