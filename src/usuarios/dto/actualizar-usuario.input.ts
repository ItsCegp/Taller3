import { InputType, PartialType } from '@nestjs/graphql';

import { CrearUsuarioInput } from './crear-usuario.input';

/**
 * Datos opcionales permitidos para actualizar un usuario.
 */
@InputType()
export class ActualizarUsuarioInput extends PartialType(CrearUsuarioInput) {}
