import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Execution } from './execution.entity'

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(Execution)
    private readonly repo: Repository<Execution>,
  ) {}

  /** 初始化一条执行记录 */
  async create(workflowId: string, workflowName: string) {
    const exec = this.repo.create({
      id: uuid(),
      workflowId,
      workflowName,
      status: 'running',
      nodeResults: {},
      logs: [],
      error: null,
      startedAt: new Date(),
      finishedAt: null,
    })
    return this.repo.save(exec)
  }

  /** 获取所有执行记录（摘要） */
  async list() {
    const all = await this.repo.find({ order: { startedAt: 'DESC' } })
    return all.map(
      ({ id, workflowId, workflowName, status, startedAt, finishedAt }) => ({
        id,
        workflowId,
        workflowName,
        status,
        startedAt,
        finishedAt,
      }),
    )
  }

  /** 获取单条执行详情 */
  async getById(id: string) {
    const exec = await this.repo.findOne({ where: { id } })
    if (!exec) throw new NotFoundException('执行记录不存在')
    return exec
  }

  /** 更新某个节点的执行结果 */
  async updateNodeResult(
    execId: string,
    nodeId: string,
    partial: Record<string, any>,
  ) {
    const exec = await this.repo.findOne({ where: { id: execId } })
    if (!exec) return
    const prev = exec.nodeResults?.[nodeId] || {}
    exec.nodeResults = {
      ...exec.nodeResults,
      [nodeId]: { ...prev, ...partial },
    }
    return this.repo.save(exec)
  }

  /** 追加日志 */
  async appendLog(execId: string, level: string, message: string) {
    const exec = await this.repo.findOne({ where: { id: execId } })
    if (!exec) return
    exec.logs = [
      ...(exec.logs || []),
      { timestamp: new Date().toISOString(), level, message },
    ]
    return this.repo.save(exec)
  }

  /** 标记执行完成 */
  async finish(execId: string, status: 'completed' | 'failed', error?: string) {
    const exec = await this.repo.findOne({ where: { id: execId } })
    if (!exec) return
    exec.status = status
    exec.finishedAt = new Date()
    if (error) exec.error = error
    return this.repo.save(exec)
  }
}
