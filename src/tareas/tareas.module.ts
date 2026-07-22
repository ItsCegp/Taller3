import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProyectosModule } from '../proyectos/proyectos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Tarea } from './entities/tarea.entity';
import { TareasResolver } from './tareas.resolver';
import { TareasService } from './tareas.service';

/**
 * Agrupa las operaciones relacionadas con las tareas.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Tarea]), UsuariosModule, ProyectosModule],
  providers: [TareasResolver, TareasService],
  exports: [TareasService],
})
export class TareasModule {}
