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
 * Datos opcionales permitidos para actualizar una tarea.
 */
@InputType()
export class ActualizarTareaInput {
  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'El título debe ser una cadena de texto',
  })
  @Length(2, 150, {
    message: 'El título debe tener entre 2 y 150 caracteres',
  })
  titulo?: string;

  @Field({
    nullable: true,
  })
  @IsOptional()
  @IsString({
    message: 'La descripción debe ser una cadena de texto',
  })
  @Length(5, 2000, {
    message: 'La descripción debe tener entre 5 y 2000 caracteres',
  })
  descripcion?: string;

  @Field(() => EstadoTarea, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(EstadoTarea, {
    message: 'El estado seleccionado no es válido',
  })
  estado?: EstadoTarea;

  @Field(() => [String], {
    nullable: true,
  })
  @IsOptional()
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
  etiquetas?: string[];

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El identificador del usuario no es válido',
  })
  usuarioAsignadoId?: string;

  @Field(() => ID, {
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4', {
    message: 'El identificador del proyecto no es válido',
  })
  proyectoId?: string;
}