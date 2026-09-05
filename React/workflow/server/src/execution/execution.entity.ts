import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity('execution')
export class Execution {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string

  @Column({ name: 'workflow_id', type: 'varchar', length: 36 })
  workflowId: string

  @Column({ name: 'workflow_name', type: 'varchar', length: 255, default: '' })
  workflowName: string

  @Column({ type: 'varchar', length: 20, default: 'running' })
  status: 'running' | 'completed' | 'failed'

  @Column({ name: 'node_results', type: 'json', nullable: true })
  nodeResults: Record<string, any>

  @Column({ type: 'json', nullable: true })
  logs: any[]

  @Column({ type: 'text', nullable: true })
  error: string | null

  @Column({ name: 'started_at', type: 'datetime' })
  startedAt: Date

  @Column({ name: 'finished_at', type: 'datetime', nullable: true })
  finishedAt: Date | null
}
