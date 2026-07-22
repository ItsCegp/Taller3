import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

/**
 * Usuario que será asignado como responsable de una tarea.
 */
@InputType()
export class AsignarUsuarioTareaInput {
  @Field(() => ID)
  @IsUUID('4', {
    message: 'El identificador del usuario no es válido',
  })
  usuarioId!: string;
}
