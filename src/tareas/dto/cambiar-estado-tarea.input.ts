import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';

import { EstadoTarea } from '../enums/estado-tarea.enum';

/**
 * Datos necesarios para cambiar el estado de una tarea.
 */
@InputType()
export class CambiarEstadoTareaInput {
  @Field(() => EstadoTarea)
  @IsEnum(EstadoTarea, {
    message: 'El estado seleccionado no es válido',
  })
  estado!: EstadoTarea;
}