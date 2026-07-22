import { Field, ID, InputType } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { EstadoTarea } from '../enums/estado-tarea.enum';

/**
 * Datos necesarios para registrar una tarea.
 */
@InputType()
export class CrearTareaInput {
  /**
   * Título de la tarea.
   */
  @Field({
    description: 'Título de la tarea',
  })
  @IsString({
    message: 'El título debe ser una cadena de texto',
  })
  @Length(2, 150, {
    message: 'El título debe tener entre 2 y 150 caracteres',
  })
  titulo!: string;

  /**
   * Descripción detallada de la tarea.
   */
  @Field({
    description: 'Descripción detallada de la tarea',
  })
  @IsString({
    message: 'La descripción debe ser una cadena de texto',
  })
  @Length(5, 2000, {
    message: 'La descripción debe tener entre 5 y 2000 caracteres',
  })
  descripcion!: string;

  /**
   * Estado inicial de la tarea.
   */
  @Field(() => EstadoTarea, {
    nullable: true,
    defaultValue: EstadoTarea.BACKLOG,
  })
  @IsOptional()
  @IsEnum(EstadoTarea, {
    message: 'El estado seleccionado no es válido',
  })
  estado?: EstadoTarea;

  /**
   * Etiquetas de clasificación.
   */
  @Field(() => [String], {
    defaultValue: [],
    description: 'Etiquetas utilizadas para clasificar la tarea',
  })
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

  /**
   * Identificador del usuario responsable.
   */
  @Field(() => ID, {
    description: 'Identificador del usuario asignado',
  })
  @IsUUID('4', {
    message: 'El identificador del usuario no es válido',
  })
  usuarioAsignadoId!: string;

  /**
   * Identificador del proyecto relacionado.
   */
  @Field(() => ID, {
    description: 'Identificador del proyecto',
  })
  @IsUUID('4', {
    message: 'El identificador del proyecto no es válido',
  })
  proyectoId!: string;
}