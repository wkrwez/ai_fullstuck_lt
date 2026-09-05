import { Injectable, Inject } from '@nestjs/common'
import { ExecutionService } from '../execution/execution.service'
import { BaseTask } from './tasks/base.task'
import { HttpRequestTask } from './tasks/http-request.task'
import { TransformTask } from './tasks/transform.task'
import { DelayTask } from './tasks/delay.task'
import { LogTask } from './tasks/log.task'
import { ScriptTask } from './tasks/script.task'
import { LlmTask } from './tasks/llm.task'

/** Maps `taskType` → its executor class instance */
type TaskMap = Map<string, BaseTask>

@Injectable()
export class ExecutorService {
  // Lazy-initialised on first run
  private taskMap: TaskMap | null = null

  constructor(
    @Inject(ExecutionService) private readonly executionService: ExecutionService,
  ) {}

  /**
   * Fire-and-forget: create an execution record, then run the workflow
   * asynchronously. Returns the execution immediately.
   */
  async run(workflow: {
    id: string
    name: string
    nodes: any[]
    edges: any[]
  }) {
    const exec = await this.executionService.create(workflow.id, workflow.name)

    // Fire async — don't await
    this.runAsync(exec.id, workflow.nodes, workflow.edges).catch((err) => {
      console.error('[executor] Fatal error:', err)
      this.executionService.finish(exec.id, 'failed', err.message)
    })

    return exec
  }

  // -----------------------------------------------------------------------
  // Internal traversal
  // -----------------------------------------------------------------------

  private async runAsync(execId: string, nodes: any[], edges: any[]) {
    const taskMap = await this.getTaskMap()

    const ctx = {
      data: {} as any,
      log: (level: string, message: string) =>
        this.executionService.appendLog(execId, level, message),
    }

    try {
      // 1. Find start node
      const startNode = nodes.find((n: any) => n.type === 'start')
      if (!startNode) throw new Error('工作流缺少开始节点')

      await this.executionService.appendLog(execId, 'info', '🚀 开始执行工作流')
      await this.markNode(execId, startNode.id, 'completed', null)

      // 2. Traverse from start
      const visited = new Set<string>()
      visited.add(startNode.id)

      const nextIds = this.outgoing(startNode.id, edges)
      for (const targetId of nextIds) {
        await this.traverse(
          execId,
          targetId,
          nodes,
          edges,
          taskMap,
          ctx,
          visited,
        )
      }

      await this.executionService.finish(execId, 'completed')
      await this.executionService.appendLog(
        execId,
        'info',
        '✅ 工作流执行完成',
      )
    } catch (err: any) {
      await this.executionService.finish(execId, 'failed', err.message)
      await this.executionService.appendLog(
        execId,
        'error',
        `❌ ${err.message}`,
      )
    }
  }

  private async traverse(
    execId: string,
    nodeId: string,
    nodes: any[],
    edges: any[],
    taskMap: TaskMap,
    ctx: { data: any; log: (level: string, msg: string) => void },
    visited: Set<string>,
  ) {
    if (visited.has(nodeId)) {
      await this.executionService.appendLog(
        execId,
        'warn',
        `🔁 跳过已访问节点: ${nodeId}`,
      )
      return
    }

    const node = nodes.find((n: any) => n.id === nodeId)
    if (!node) return

    visited.add(nodeId)
    await this.markNode(execId, nodeId, 'running', null)

    try {
      let output: any = null
      let nextNodeIds = this.outgoing(nodeId, edges)

      switch (node.type) {
        case 'end':
          await this.executionService.appendLog(
            execId,
            'info',
            `🏁 到达结束节点: ${node.data?.label || nodeId}`,
          )
          break

        case 'task': {
          const taskType = node.data?.taskType
          const executor = taskMap.get(taskType)
          if (!executor) throw new Error(`未知的任务类型: ${taskType}`)

          const label = node.data?.label || nodeId
          await this.executionService.appendLog(
            execId,
            'info',
            `▶ 执行任务 [${label}] (${taskType})`,
          )
          output = await executor.execute(node.data?.config || {}, ctx)
          await this.executionService.appendLog(
            execId,
            'info',
            `✔ 任务完成 [${label}]`,
          )
          break
        }

        case 'condition': {
          const expression = node.data?.config?.expression
          const result = this.evaluateCondition(expression, ctx.data)

          await this.executionService.appendLog(
            execId,
            'info',
            `🔀 条件判断 [${node.data?.label || nodeId}]: ${result}`,
          )

          const branchHandle = result ? 'true' : 'false'
          nextNodeIds = this.outgoing(nodeId, edges, branchHandle)
          output = { condition: expression, result, branch: branchHandle }
          break
        }

        default:
          await this.executionService.appendLog(
            execId,
            'warn',
            `⚠ 未知节点类型: ${node.type}`,
          )
      }

      await this.markNode(execId, nodeId, 'completed', output)

      for (const nextId of nextNodeIds) {
        await this.traverse(
          execId,
          nextId,
          nodes,
          edges,
          taskMap,
          ctx,
          visited,
        )
      }
    } catch (err: any) {
      await this.executionService.updateNodeResult(execId, nodeId, {
        status: 'error',
        error: err.message,
        finishedAt: new Date().toISOString(),
      })
      throw err
    }
  }

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  private markNode(execId: string, nodeId: string, status: string, output: any) {
    const now = new Date().toISOString()
    return this.executionService.updateNodeResult(execId, nodeId, {
      status,
      output,
      error: null,
      startedAt: status === 'running' ? now : undefined,
      finishedAt: status === 'completed' ? now : undefined,
    })
  }

  /**
   * Get outgoing target IDs. When `sourceHandle` is given, only match edges
   * with that `sourceHandle` (condition branching).
   */
  private outgoing(
    nodeId: string,
    edges: any[],
    sourceHandle?: string,
  ): string[] {
    return edges
      .filter((e: any) => {
        if (e.source !== nodeId) return false
        if (sourceHandle !== undefined) return e.sourceHandle === sourceHandle
        return true
      })
      .map((e: any) => e.target)
  }

  /**
   * Evaluate a condition expression against ctx data.
   * Uses `new Function` for sandboxed evaluation.
   */
  private evaluateCondition(expression: any, data: any): boolean {
    if (!expression || String(expression).trim() === '') return true
    try {
      const fn = new Function('data', `return !!(${expression})`)
      return Boolean(fn(data))
    } catch {
      return true
    }
  }

  /**
   * Lazy-initialise the task executor map.
   * We manually instantiate each task class so we can use DI if needed later.
   */
  private async getTaskMap(): Promise<TaskMap> {
    if (this.taskMap) return this.taskMap

    const tasks: BaseTask[] = [
      new HttpRequestTask(),
      new TransformTask(),
      new DelayTask(),
      new LogTask(),
      new ScriptTask(),
      new LlmTask(),
    ]

    this.taskMap = new Map(tasks.map((t) => [t.type, t]))
    return this.taskMap
  }
}
