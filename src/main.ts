import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

function buildCorsChecker() {
  const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
  const env = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowList = new Set(env);

  return (origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) => {
    if (!origin) return cb(null, true); // curl/Postman
    if (allowList.has('*') || allowList.has(origin) || localhostRegex.test(origin)) {
      return cb(null, true);
    }
    return cb(new Error(`CORS bloqueado para origen: ${origin}`), false);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(LoggerMiddleware);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: buildCorsChecker(),
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    maxAge: 86400,
  });

  const PORT = Number(process.env.PORT || 3001);

  process.on('uncaughtException', (err) => {
    console.error('Excepción no capturada:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo no manejado:', reason);
  });

  await app.listen(PORT);
  console.log(`> API Cash-Future escuchando en http://localhost:${PORT}`);
  console.log(`> CORS: localhost/127.* habilitados + FRONTEND_ORIGIN=${process.env.FRONTEND_ORIGIN || '(vacío)'}`);
}
bootstrap();
