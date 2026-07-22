import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProyectosService } from '../proyectos/proyectos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { ActualizarTareaInput } from './dto/actualizar-tarea.input';
import { CrearTareaInput } from './dto/crear-tarea.input';
import { EstadoTarea } from './enums/estado-tarea.enum';
import { Tarea } from './entities/tarea.entity';

/**
 * Contiene las operaciones de negocio relacionadas con las tareas.
 */
@Injectable()
export class TareasService {
  constructor(
    @InjectRepository(Tarea)
    private readonly tareasRepository: Repository<Tarea>,
    private readonly usuariosService: UsuariosService,
    private readonly proyectosService: ProyectosService,
  ) {}

  /**
   * Obtiene todas las tareas registradas.
   *
   * @returns Lista de tareas con su usuario y proyecto.
   */
  obtenerTodas(): Promise<Tarea[]> {
    return this.tareasRepository.find({
      relations: {
        usuarioAsignado: true,
        proyecto: true,
      },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }

  /**
   * Busca una tarea por su identificador.
   *
   * @param id Identificador único de la tarea.
   * @returns Tarea encontrada.
   * @throws NotFoundException Cuando la tarea no existe.
   */
  async obtenerPorId(id: string): Promise<Tarea> {
    const tarea = await this.tareasRepository.findOne({
      where: {
        id,
      },
      relations: {
        usuarioAsignado: true,
        proyecto: true,
      },
    });

    if (!tarea) {
      throw new NotFoundException(
        `No se encontró una tarea con el identificador "${id}"`,
      );
    }

    return tarea;
  }

  /**
   * Registra una nueva tarea.
   *
   * @param input Datos necesarios para crear la tarea.
   * @returns Tarea creada.
   */
  async crear(input: CrearTareaInput): Promise<Tarea> {
    const usuarioAsignado = await this.usuariosService.obtenerPorId(
      input.usuarioAsignadoId,
    );

    const proyecto = await this.proyectosService.obtenerPorId(input.proyectoId);

    const tarea = this.tareasRepository.create({
      titulo: input.titulo.trim(),
      descripcion: input.descripcion.trim(),
      estado: input.estado ?? EstadoTarea.BACKLOG,
      etiquetas: this.normalizarEtiquetas(input.etiquetas),
      usuarioAsignado,
      proyecto,
    });

    const tareaGuardada = await this.tareasRepository.save(tarea);

    return this.obtenerPorId(tareaGuardada.id);
  }

  /**
   * Actualiza los datos generales de una tarea.
   *
   * @param id Identificador de la tarea.
   * @param input Datos que serán modificados.
   * @returns Tarea actualizada.
   */
  async actualizar(id: string, input: ActualizarTareaInput): Promise<Tarea> {
    const tarea = await this.obtenerPorId(id);

    if (input.titulo !== undefined) {
      tarea.titulo = input.titulo.trim();
    }

    if (input.descripcion !== undefined) {
      tarea.descripcion = input.descripcion.trim();
    }

    if (input.estado !== undefined) {
      tarea.estado = input.estado;
    }

    if (input.etiquetas !== undefined) {
      tarea.etiquetas = this.normalizarEtiquetas(input.etiquetas);
    }

    if (input.usuarioAsignadoId !== undefined) {
      tarea.usuarioAsignado = await this.usuariosService.obtenerPorId(
        input.usuarioAsignadoId,
      );
    }

    if (input.proyectoId !== undefined) {
      tarea.proyecto = await this.proyectosService.obtenerPorId(
        input.proyectoId,
      );
    }

    await this.tareasRepository.save(tarea);

    return this.obtenerPorId(tarea.id);
  }

  /**
   * Cambia el estado actual de una tarea.
   *
   * @param id Identificador de la tarea.
   * @param estado Nuevo estado.
   * @returns Tarea actualizada.
   */
  async cambiarEstado(id: string, estado: EstadoTarea): Promise<Tarea> {
    const tarea = await this.obtenerPorId(id);

    tarea.estado = estado;

    await this.tareasRepository.save(tarea);

    return this.obtenerPorId(tarea.id);
  }

  /**
   * Sustituye las etiquetas de una tarea.
   *
   * @param id Identificador de la tarea.
   * @param etiquetas Nuevas etiquetas.
   * @returns Tarea actualizada.
   */
  async actualizarEtiquetas(id: string, etiquetas: string[]): Promise<Tarea> {
    const tarea = await this.obtenerPorId(id);

    tarea.etiquetas = this.normalizarEtiquetas(etiquetas);

    await this.tareasRepository.save(tarea);

    return this.obtenerPorId(tarea.id);
  }

  /**
   * Asigna un usuario como responsable de una tarea.
   *
   * @param id Identificador de la tarea.
   * @param usuarioId Identificador del nuevo responsable.
   * @returns Tarea actualizada.
   */
  async asignarUsuario(id: string, usuarioId: string): Promise<Tarea> {
    const tarea = await this.obtenerPorId(id);
    const usuario = await this.usuariosService.obtenerPorId(usuarioId);

    tarea.usuarioAsignado = usuario;

    await this.tareasRepository.save(tarea);

    return this.obtenerPorId(tarea.id);
  }

  /**
   * Elimina una tarea.
   *
   * @param id Identificador de la tarea.
   * @returns `true` cuando la tarea fue eliminada.
   */
  async eliminar(id: string): Promise<boolean> {
    const tarea = await this.obtenerPorId(id);

    await this.tareasRepository.remove(tarea);

    return true;
  }

  /**
   * Limpia y elimina etiquetas repetidas sin distinguir mayúsculas.
   *
   * Conserva la primera variante escrita de cada etiqueta.
   *
   * @param etiquetas Etiquetas originales.
   * @returns Arreglo de etiquetas normalizadas.
   */
  /**
   * Limpia y elimina etiquetas repetidas sin distinguir mayúsculas.
   *
   * Conserva la primera variante escrita de cada etiqueta.
   *
   * @param etiquetas Etiquetas originales.
   * @returns Arreglo de etiquetas normalizadas.
   */
  private normalizarEtiquetas(etiquetas: string[]): string[] {
    const etiquetasUnicas: string[] = [];
    const etiquetasRegistradas = new Set<string>();

    for (const etiqueta of etiquetas) {
      const etiquetaLimpia = etiqueta.trim();

      if (etiquetaLimpia.length === 0) {
        continue;
      }

      const claveNormalizada = etiquetaLimpia.toLowerCase();

      if (etiquetasRegistradas.has(claveNormalizada)) {
        continue;
      }

      etiquetasRegistradas.add(claveNormalizada);
      etiquetasUnicas.push(etiquetaLimpia);
    }

    return etiquetasUnicas;
  }
}
