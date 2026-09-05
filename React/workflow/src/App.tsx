import Sidebar from "./components/Sidebar";
import WorkflowCanvas from "./components/WorkflowCanvas";
import WorkflowToolbar from "./components/WorkflowToolbar";
import NodeConfigPanel from "./components/NodeConfigPanel";
import { useWorkflowStore } from "./store/workflowStore";

export default function App() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      {/* 顶部工具栏 */}
      <WorkflowToolbar />

      {/* 主区域：左侧面板 + 画布 + 右侧配置面板 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧 —— 节点面板 */}
        <Sidebar />

        {/* 中间 —— 流程画布 */}
        <WorkflowCanvas />

        {/* 右侧 —— 节点配置面板（选中节点时可见） */}
        {selectedNodeId && <NodeConfigPanel />}
      </div>
    </div>
  );
}
