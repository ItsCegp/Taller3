import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario } from './entities/usuario.entity';
import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosService } from './usuarios.service';

/**
 * Agrupa las operaciones relacionadas con los usuarios.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosResolver, UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
