import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Inject,
} from '@nestjs/common'
import { WorkflowService } from './workflow.service'
import { CreateWorkflowDto } from './dto/create-workflow.dto'
import { UpdateWorkflowDto } from './dto/update-workflow.dto'
import { ExecutorService } from '../engine/executor.service'

@Controller('workflows')
export class WorkflowController {
  constructor(
    @Inject(WorkflowService) private readonly workflowService: WorkflowService,
    @Inject(ExecutorService) private readonly executorService: ExecutorService,
  ) {}

  @Get()
  async list() {
    const data = await this.workflowService.list()
    return { success: true, data }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const data = await this.workflowService.getById(id)
    return { success: true, data }
  }

  @Post()
  async create(@Body() dto: CreateWorkflowDto) {
    const data = await this.workflowService.create(dto)
    return { success: true, data }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    const data = await this.workflowService.update(id, dto)
    return { success: true, data }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.workflowService.remove(id)
    return { success: true, data: null }
  }

  /** 执行工作流 — 异步, 立即返回 executionId */
  @Post(':id/execute')
  async execute(@Param('id') id: string) {
    const doc = await this.workflowService.getById(id)
    const execution = await this.executorService.run(doc)
    return { success: true, data: { executionId: execution.id } }
  }
}
