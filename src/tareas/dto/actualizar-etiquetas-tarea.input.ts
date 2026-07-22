import { Field, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

/**
 * Etiquetas que serán asignadas a una tarea.
 */
@InputType()
export class ActualizarEtiquetasTareaInput {
  @Field(() => [String])
  @IsArray({
    message: 'Las etiquetas deben ser un arreglo',
  })
  @ArrayMaxSize(20, {
    message: 'Una tarea no puede tener más de 20 etiquetas',
  })
  @ArrayUnique({
    message: 'Las etiquetas no pueden estar repetidas',
  })
  @IsString({
    each: true,
    message: 'Cada etiqueta debe ser una cadena de texto',
  })
  @Length(1, 30, {
    each: true,
    message: 'Cada etiqueta debe tener entre 1 y 30 caracteres',
  })
  etiquetas!: string[];
}