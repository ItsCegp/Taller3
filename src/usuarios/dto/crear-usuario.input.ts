import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

/**
 * Datos necesarios para crear un usuario.
 */
@InputType()
export class CrearUsuarioInput {
  /**
   * Nombre completo del usuario.
   */
  @Field({
    description: 'Nombre completo del usuario',
  })
  @IsString({
    message: 'El nombre debe ser una cadena de texto',
  })
  @Length(2, 100, {
    message: 'El nombre debe tener entre 2 y 100 caracteres',
  })
  nombre!: string;

  /**
   * Correo electrónico del usuario.
   */
  @Field({
    description: 'Correo electrónico único del usuario',
  })
  @IsEmail(
    {},
    {
      message: 'El correo electrónico no es válido',
    },
  )
  @MaxLength(150, {
    message: 'El correo no puede superar los 150 caracteres',
  })
  correo!: string;
}
