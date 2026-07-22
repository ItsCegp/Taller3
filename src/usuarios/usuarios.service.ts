import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActualizarUsuarioInput } from './dto/actualizar-usuario.input';
import { CrearUsuarioInput } from './dto/crear-usuario.input';
import { Usuario } from './entities/usuario.entity';

/**
 * Contiene las operaciones de negocio relacionadas con los usuarios.
 */
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  /**
   * Obtiene todos los usuarios registrados.
   *
   * @returns Lista de usuarios ordenada por nombre.
   */
  obtenerTodos(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      order: {
        nombre: 'ASC',
      },
    });
  }

  /**
   * Busca un usuario por su identificador.
   *
   * @param id Identificador único del usuario.
   * @returns Usuario encontrado.
   * @throws NotFoundException Cuando el usuario no existe.
   */
  async obtenerPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });

    if (!usuario) {
      throw new NotFoundException(
        `No se encontró un usuario con el identificador "${id}"`,
      );
    }

    return usuario;
  }

  /**
   * Crea un nuevo usuario.
   *
   * @param input Datos necesarios para crear el usuario.
   * @returns Usuario creado.
   * @throws ConflictException Cuando el correo ya está registrado.
   */
  async crear(input: CrearUsuarioInput): Promise<Usuario> {
    const correoNormalizado = input.correo.trim().toLowerCase();

    await this.validarCorreoDisponible(correoNormalizado);

    const usuario = this.usuariosRepository.create({
      nombre: input.nombre.trim(),
      correo: correoNormalizado,
    });

    return this.usuariosRepository.save(usuario);
  }

  /**
   * Actualiza los datos de un usuario.
   *
   * @param id Identificador único del usuario.
   * @param input Datos que serán modificados.
   * @returns Usuario actualizado.
   */
  async actualizar(
    id: string,
    input: ActualizarUsuarioInput,
  ): Promise<Usuario> {
    const usuario = await this.obtenerPorId(id);

    if (input.correo !== undefined) {
      const correoNormalizado = input.correo.trim().toLowerCase();

      if (correoNormalizado !== usuario.correo) {
        await this.validarCorreoDisponible(correoNormalizado);
      }

      usuario.correo = correoNormalizado;
    }

    if (input.nombre !== undefined) {
      usuario.nombre = input.nombre.trim();
    }

    return this.usuariosRepository.save(usuario);
  }

  /**
   * Elimina un usuario registrado.
   *
   * @param id Identificador único del usuario.
   * @returns `true` cuando el usuario fue eliminado.
   */
  async eliminar(id: string): Promise<boolean> {
    const usuario = await this.obtenerPorId(id);

    await this.usuariosRepository.remove(usuario);

    return true;
  }

  /**
   * Comprueba que un correo no esté registrado.
   *
   * @param correo Correo electrónico normalizado.
   * @throws ConflictException Cuando el correo ya está registrado.
   */
  private async validarCorreoDisponible(correo: string): Promise<void> {
    const usuarioExistente = await this.usuariosRepository.findOneBy({
      correo,
    });

    if (usuarioExistente) {
      throw new ConflictException(
        `Ya existe un usuario registrado con el correo "${correo}"`,
      );
    }
  }
}
