import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuditoriaInterceptor } from './auditoria.interceptor';

/**
 * Registra globalmente el aspecto de auditoría.
 */
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditoriaInterceptor,
    },
  ],
})
export class AuditoriaModule {}
