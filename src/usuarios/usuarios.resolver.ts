import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ActualizarUsuarioInput } from './dto/actualizar-usuario.input';
import { CrearUsuarioInput } from './dto/crear-usuario.input';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './usuarios.service';

/**
 * Expone las consultas y mutaciones GraphQL relacionadas con usuarios.
 */
@Resolver(() => Usuario)
export class UsuariosResolver {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Consulta todos los usuarios registrados.
   *
   * @returns Lista de usuarios.
   */
  @Query(() => [Usuario], {
    name: 'usuarios',
    description: 'Obtiene todos los usuarios registrados',
  })
  obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerTodos();
  }

  /**
   * Consulta un usuario por su identificador.
   *
   * @param id Identificador único del usuario.
   * @returns Usuario encontrado.
   */
  @Query(() => Usuario, {
    name: 'usuario',
    description: 'Obtiene un usuario por su identificador',
  })
  obtenerUsuario(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<Usuario> {
    return this.usuariosService.obtenerPorId(id);
  }

  /**
   * Registra un usuario.
   *
   * @param input Datos del nuevo usuario.
   * @returns Usuario creado.
   */
  @Mutation(() => Usuario, {
    name: 'crearUsuario',
    description: 'Crea un nuevo usuario',
  })
  crearUsuario(@Args('input') input: CrearUsuarioInput): Promise<Usuario> {
    return this.usuariosService.crear(input);
  }

  /**
   * Modifica los datos de un usuario.
   *
   * @param id Identificador único del usuario.
   * @param input Datos que serán modificados.
   * @returns Usuario actualizado.
   */
  @Mutation(() => Usuario, {
    name: 'actualizarUsuario',
    description: 'Actualiza los datos de un usuario',
  })
  actualizarUsuario(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: ActualizarUsuarioInput,
  ): Promise<Usuario> {
    return this.usuariosService.actualizar(id, input);
  }

  /**
   * Elimina un usuario.
   *
   * @param id Identificador único del usuario.
   * @returns Confirmación de la eliminación.
   */
  @Mutation(() => Boolean, {
    name: 'eliminarUsuario',
    description: 'Elimina un usuario registrado',
  })
  eliminarUsuario(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<boolean> {
    return this.usuariosService.eliminar(id);
  }
}
