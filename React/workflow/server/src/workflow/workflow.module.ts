import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Workflow } from './workflow.entity'
import { WorkflowService } from './workflow.service'
import { WorkflowController } from './workflow.controller'
import { EngineModule } from '../engine/engine.module'

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), EngineModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
