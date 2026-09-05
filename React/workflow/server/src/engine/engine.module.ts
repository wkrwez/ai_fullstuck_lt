import { Module } from '@nestjs/common'
import { ExecutorService } from './executor.service'
import { ExecutionModule } from '../execution/execution.module'
import { LlmController } from './llm.controller'

@Module({
  imports: [ExecutionModule],
  controllers: [LlmController],
  providers: [ExecutorService],
  exports: [ExecutorService],
})
export class EngineModule {}
