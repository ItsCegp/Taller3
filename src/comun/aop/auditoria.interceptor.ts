import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { AccionAuditoria } from './accion-auditoria.enum';
import { CLAVE_ACCION_AUDITORIA } from './auditar.decorator';

/**
 * Aplica auditoría transversal a los resolvers marcados con `@Auditar()`.
 *
 * Registra el comienzo, resultado, duración y posibles errores de cada
 * operación sin incorporar código de logging dentro de los servicios.
 */
@Injectable()
export class AuditoriaInterceptor implements NestInterceptor<unknown, unknown> {
  private readonly logger = new Logger(AuditoriaInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  /**
   * Intercepta la ejecución de un resolver auditado.
   *
   * @param context Contexto de ejecución proporcionado por NestJS.
   * @param next Flujo que ejecutará el resolver original.
   * @returns Observable con el resultado original del resolver.
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    const accion = this.reflector.getAllAndOverride<AccionAuditoria>(
      CLAVE_ACCION_AUDITORIA,
      [context.getHandler(), context.getClass()],
    );

    if (!accion) {
      return next.handle();
    }

    const contextoGraphql = GqlExecutionContext.create(context);
    const informacion = contextoGraphql.getInfo<{ fieldName: string }>();
    const argumentos = contextoGraphql.getArgs<Record<string, unknown>>();

    const fechaInicio = Date.now();
    const identificador =
      typeof argumentos.id === 'string' ? argumentos.id : undefined;

    const camposEntrada = this.obtenerCamposEntrada(argumentos);

    this.logger.log(
      JSON.stringify({
        evento: 'INICIO',
        accion,
        resolver: informacion.fieldName,
        identificador,
        camposEntrada,
      }),
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          JSON.stringify({
            evento: 'EXITO',
            accion,
            resolver: informacion.fieldName,
            identificador,
            duracionMs: Date.now() - fechaInicio,
          }),
        );
      }),

      catchError((error: unknown) => {
        const mensajeError =
          error instanceof Error ? error.message : 'Error desconocido';

        const traza = error instanceof Error ? error.stack : undefined;

        this.logger.error(
          JSON.stringify({
            evento: 'ERROR',
            accion,
            resolver: informacion.fieldName,
            identificador,
            duracionMs: Date.now() - fechaInicio,
            mensaje: mensajeError,
          }),
          traza,
        );

        return throwError(() => error);
      }),
    );
  }

  /**
   * Obtiene únicamente los nombres de los campos enviados.
   *
   * No registra los valores completos para evitar exponer datos
   * innecesarios o sensibles en los logs.
   *
   * @param argumentos Argumentos recibidos por el resolver GraphQL.
   * @returns Nombres de los campos incluidos en `input`.
   */
  private obtenerCamposEntrada(argumentos: Record<string, unknown>): string[] {
    const input = argumentos.input;

    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      return [];
    }

    return Object.keys(input);
  }
}
