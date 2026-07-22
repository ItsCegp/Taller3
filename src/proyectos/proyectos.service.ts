import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActualizarProyectoInput } from './dto/actualizar-proyecto.input';
import { CrearProyectoInput } from './dto/crear-proyecto.input';
import { Proyecto } from './entities/proyecto.entity';

/**
 * Contiene las operaciones de negocio relacionadas con los proyectos.
 */
@Injectable()
export class ProyectosService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectosRepository: Repository<Proyecto>,
  ) {}

  /**
   * Obtiene todos los proyectos registrados.
   *
   * @returns Lista de proyectos ordenada por nombre.
   */
  obtenerTodos(): Promise<Proyecto[]> {
    return this.proyectosRepository.find({
      order: {
        nombre: 'ASC',
      },
    });
  }

  /**
   * Busca un proyecto por su identificador.
   *
   * @param id Identificador único del proyecto.
   * @returns Proyecto encontrado.
   * @throws NotFoundException Cuando el proyecto no existe.
   */
  async obtenerPorId(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectosRepository.findOneBy({ id });

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontró un proyecto con el identificador "${id}"`,
      );
    }

    return proyecto;
  }

  /**
   * Registra un nuevo proyecto.
   *
   * @param input Datos necesarios para crear el proyecto.
   * @returns Proyecto creado.
   * @throws ConflictException Cuando el nombre ya está registrado.
   */
  async crear(input: CrearProyectoInput): Promise<Proyecto> {
    const nombreNormalizado = input.nombre.trim();

    await this.validarNombreDisponible(nombreNormalizado);

    const proyecto = this.proyectosRepository.create({
      nombre: nombreNormalizado,
      descripcion: input.descripcion.trim(),
    });

    return this.proyectosRepository.save(proyecto);
  }

  /**
   * Actualiza los datos de un proyecto.
   *
   * @param id Identificador único del proyecto.
   * @param input Datos que serán modificados.
   * @returns Proyecto actualizado.
   */
  async actualizar(
    id: string,
    input: ActualizarProyectoInput,
  ): Promise<Proyecto> {
    const proyecto = await this.obtenerPorId(id);

    if (input.nombre !== undefined) {
      const nombreNormalizado = input.nombre.trim();

      if (nombreNormalizado !== proyecto.nombre) {
        await this.validarNombreDisponible(nombreNormalizado);
      }

      proyecto.nombre = nombreNormalizado;
    }

    if (input.descripcion !== undefined) {
      proyecto.descripcion = input.descripcion.trim();
    }

    return this.proyectosRepository.save(proyecto);
  }

  /**
   * Elimina un proyecto registrado.
   *
   * @param id Identificador único del proyecto.
   * @returns `true` cuando el proyecto fue eliminado.
   */
  async eliminar(id: string): Promise<boolean> {
    const proyecto = await this.obtenerPorId(id);

    await this.proyectosRepository.remove(proyecto);

    return true;
  }

  /**
   * Comprueba que el nombre de un proyecto esté disponible.
   *
   * @param nombre Nombre que será comprobado.
   * @throws ConflictException Cuando el nombre ya está registrado.
   */
  private async validarNombreDisponible(nombre: string): Promise<void> {
    const proyectoExistente = await this.proyectosRepository.findOneBy({
      nombre,
    });

    if (proyectoExistente) {
      throw new ConflictException(
        `Ya existe un proyecto registrado con el nombre "${nombre}"`,
      );
    }
  }
}
