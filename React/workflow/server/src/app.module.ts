import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { WorkflowModule } from './workflow/workflow.module'
import { ExecutionModule } from './execution/execution.module'
import { EngineModule } from './engine/engine.module'
import { Workflow } from './workflow/workflow.entity'
import { Execution } from './execution/execution.entity'

@Module({
  imports: [
    // TypeORM — MySQL 连接
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'navicat',
      password: 'Navicat@123',
      database: 'workflow',
      entities: [Workflow, Execution],
      // synchronize: true 仅开发用，生产应使用 migration
      synchronize: true,
      // MySQL 8 默认使用 caching_sha2_password
      connectTimeout: 10000,
    }),
    WorkflowModule,
    ExecutionModule,
    EngineModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
