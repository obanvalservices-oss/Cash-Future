// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS DEV: permitir localhost/127.0.0.1 y cualquier otro (para pruebas)
  app.enableCors({
    origin: (origin, cb) => {
      // Permite herramientas sin Origin (curl, Postman) y cualquier página en dev
      if (!origin) return cb(null, true);
      const allow = [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      if (allow.includes(origin)) return cb(null, true);
      // En dev, permite todo para evitar falsos bloqueos
      return cb(null, true);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // No usamos cookies/sessions, así que desactiva credenciales para simplificar CORS
    credentials: false,
  });

  await app.listen(3000);
  console.log('> API on http://localhost:3000');
}
bootstrap();
