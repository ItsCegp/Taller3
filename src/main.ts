import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port);

  logger.log(`Servidor listo en http://localhost:${port}`);
  logger.log(`GraphQL disponible en http://localhost:${port}/graphql`);
}

void bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  const message = error instanceof Error ? error.message : 'Error desconocido';

  logger.error(`No fue posible iniciar el servidor: ${message}`);
  process.exit(1);
});
