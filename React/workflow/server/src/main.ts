import 'dotenv/config'
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局前缀 /api
  app.setGlobalPrefix('api')

  // CORS — 允许前端开发服务器访问
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })

  // 全局校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  )

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 Workflow server running on http://localhost:${port}`)
  console.log(`   Health: http://localhost:${port}/api/health`)
}

bootstrap()
