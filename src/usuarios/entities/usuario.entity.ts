import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Representa un usuario que puede ser asignado como responsable de una tarea.
 */
@ObjectType({
  description: 'Usuario disponible para ser asignado a tareas',
})
@Entity('usuarios')
export class Usuario {
  /**
   * Identificador único del usuario.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Nombre completo del usuario.
   */
  @Field()
  @Column({
    length: 100,
  })
  nombre!: string;

  /**
   * Correo electrónico único del usuario.
   */
  @Field()
  @Column({
    length: 150,
    unique: true,
  })
  correo!: string;

  /**
   * Fecha en la que fue creado el usuario.
   */
  @Field(() => Date)
  @CreateDateColumn({
    type: 'datetime',
  })
  fechaCreacion!: Date;

  /**
   * Fecha de la última modificación del usuario.
   */
  @Field(() => Date)
  @UpdateDateColumn({
    type: 'datetime',
  })
  fechaActualizacion!: Date;
}
