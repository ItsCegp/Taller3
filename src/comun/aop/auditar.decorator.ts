import { SetMetadata } from '@nestjs/common';

import { AccionAuditoria } from './accion-auditoria.enum';

export const CLAVE_ACCION_AUDITORIA = 'accion_auditoria';

/**
 * Marca un resolver para que su ejecución sea auditada.
 *
 * Esta función es una función de orden superior porque recibe una acción
 * y devuelve un decorador. Además, utiliza una clausura para conservar
 * el valor de la acción hasta que el interceptor consulte la metadata.
 *
 * @param accion Acción que será registrada por el interceptor.
 * @returns Decorador aplicable a un método.
 */
export const Auditar = (accion: AccionAuditoria): MethodDecorator =>
  SetMetadata(CLAVE_ACCION_AUDITORIA, accion);
