/**
 * Abstract base class for task executors.
 * Each task type extends this and implements `execute()`.
 */
export abstract class BaseTask {
  abstract readonly type: string

  /**
   * Execute the task.
   * @param config  - The node's `data.config` object
   * @param ctx     - Mutable execution context { data, log(level, msg) }
   * @returns The task output (stored in nodeResults)
   */
  abstract execute(
    config: Record<string, any> | undefined,
    ctx: { data: any; log: (level: string, msg: string) => void },
  ): Promise<any>
}
