import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Proyecto } from '../../proyectos/entities/proyecto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoTarea } from '../enums/estado-tarea.enum';

/**
 * Representa una tarea perteneciente a un proyecto de software.
 */
@ObjectType({
  description: 'Tarea perteneciente a un proyecto de desarrollo',
})
@Entity('tareas')
export class Tarea {
  /**
   * Identificador único de la tarea.
   */
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Título de la tarea.
   */
  @Field()
  @Column({
    length: 150,
  })
  titulo!: string;

  /**
   * Descripción detallada de la tarea.
   */
  @Field()
  @Column({
    type: 'text',
  })
  descripcion!: string;

  /**
   * Estado actual de la tarea.
   */
  @Field(() => EstadoTarea)
  @Column({
    type: 'simple-enum',
    enum: EstadoTarea,
    default: EstadoTarea.BACKLOG,
  })
  estado!: EstadoTarea;

  /**
   * Etiquetas utilizadas para clasificar la tarea.
   */
  @Field(() => [String])
  @Column({
    type: 'simple-json',
    default: '[]',
  })
  etiquetas!: string[];

  /**
   * Fecha de creación de la tarea.
   */
  @Field(() => Date)
  @CreateDateColumn({
    type: 'datetime',
  })
  fechaCreacion!: Date;

  /**
   * Fecha de la última modificación.
   */
  @Field(() => Date)
  @UpdateDateColumn({
    type: 'datetime',
  })
  fechaActualizacion!: Date;

  /**
   * Usuario responsable de la tarea.
   */
  @Field(() => Usuario)
  @ManyToOne(() => Usuario, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'usuario_asignado_id',
  })
  usuarioAsignado!: Usuario;

  /**
   * Proyecto al que pertenece la tarea.
   */
  @Field(() => Proyecto)
  @ManyToOne(() => Proyecto, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'proyecto_id',
  })
  proyecto!: Proyecto;
}