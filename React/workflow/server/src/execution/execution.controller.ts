import { Controller, Get, Param, Inject } from '@nestjs/common'
import { ExecutionService } from './execution.service'

@Controller('executions')
export class ExecutionController {
  constructor(
    @Inject(ExecutionService) private readonly executionService: ExecutionService,
  ) {}

  @Get()
  async list() {
    const data = await this.executionService.list()
    return { success: true, data }
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const data = await this.executionService.getById(id)
    return { success: true, data }
  }
}
