import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Representa un proyecto de desarrollo de software.
 */
@ObjectType({
  description: 'Proyecto al que pueden pertenecer diferentes tareas',
})
@Entity('proyectos')
export class Proyecto {
  /**
   * Identificador único del proyecto.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Nombre del proyecto.
   */
  @Field()
  @Column({
    length: 120,
    unique: true,
  })
  nombre!: string;

  /**
   * Descripción general del proyecto.
   */
  @Field()
  @Column({
    type: 'text',
  })
  descripcion!: string;

  /**
   * Fecha en la que fue creado el proyecto.
   */
  @Field(() => Date)
  @CreateDateColumn({
    type: 'datetime',
  })
  fechaCreacion!: Date;

  /**
   * Fecha de la última actualización del proyecto.
   */
  @Field(() => Date)
  @UpdateDateColumn({
    type: 'datetime',
  })
  fechaActualizacion!: Date;
}
