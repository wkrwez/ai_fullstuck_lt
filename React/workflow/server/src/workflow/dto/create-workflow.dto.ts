import { IsString, IsArray, IsOptional, MaxLength } from 'class-validator'

export class CreateWorkflowDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string

  @IsArray()
  @IsOptional()
  nodes?: any[]

  @IsArray()
  @IsOptional()
  edges?: any[]
}
