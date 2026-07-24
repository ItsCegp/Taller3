import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * Datos necesarios para registrar un proyecto.
 */
@InputType()
export class CrearProyectoInput {
  /**
   * Nombre que identifica al proyecto.
   */
  @Field({
    description: 'Nombre único del proyecto',
  })
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  @Length(2, 120, {
    message: 'El nombre debe tener entre 2 y 120 caracteres',
  })
  nombre!: string;

  /**
   * Descripción general del proyecto.
   */
  @Field({
    description: 'Descripción general del proyecto',
  })
  @IsString({
    message: 'La descripción debe ser una cadena de texto',
  })
  @IsNotEmpty({
    message: 'La descripción no puede estar vacía',
  })
  @Length(5, 1000, {
    message: 'La descripción debe tener entre 5 y 1000 caracteres',
  })
  descripcion!: string;
}
