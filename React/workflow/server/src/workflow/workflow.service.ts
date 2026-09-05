import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Workflow } from './workflow.entity'
import type { CreateWorkflowDto } from './dto/create-workflow.dto'
import type { UpdateWorkflowDto } from './dto/update-workflow.dto'

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private readonly repo: Repository<Workflow>,
  ) {}

  /** 列出所有工作流（轻量摘要，不含 nodes/edges） */
  async list() {
    const all = await this.repo.find({
      order: { updatedAt: 'DESC' },
    })
    return all.map(({ id, name, createdAt, updatedAt }) => ({
      id,
      name,
      createdAt,
      updatedAt,
    }))
  }

  /** 获取单个工作流完整数据 */
  async getById(id: string) {
    const doc = await this.repo.findOne({ where: { id } })
    if (!doc) throw new NotFoundException('工作流不存在')
    return doc
  }

  /** 创建新工作流 */
  async create(dto: CreateWorkflowDto) {
    const doc = this.repo.create({
      id: uuid(),
      name: dto.name || '未命名工作流',
      nodes: dto.nodes || [],
      edges: dto.edges || [],
    })
    return this.repo.save(doc)
  }

  /** 更新工作流 */
  async update(id: string, dto: UpdateWorkflowDto) {
    const doc = await this.repo.findOne({ where: { id } })
    if (!doc) throw new NotFoundException('工作流不存在')

    if (dto.name !== undefined) doc.name = dto.name
    if (dto.nodes !== undefined) doc.nodes = dto.nodes
    if (dto.edges !== undefined) doc.edges = dto.edges

    return this.repo.save(doc)
  }

  /** 删除工作流 */
  async remove(id: string) {
    const doc = await this.repo.findOne({ where: { id } })
    if (!doc) throw new NotFoundException('工作流不存在')
    await this.repo.remove(doc)
  }
}
