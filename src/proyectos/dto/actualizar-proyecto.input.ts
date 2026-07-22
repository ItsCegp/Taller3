import { InputType, PartialType } from '@nestjs/graphql';

import { CrearProyectoInput } from './crear-proyecto.input';

/**
 * Datos opcionales permitidos para actualizar un proyecto.
 */
@InputType()
export class ActualizarProyectoInput extends PartialType(CrearProyectoInput) {}
