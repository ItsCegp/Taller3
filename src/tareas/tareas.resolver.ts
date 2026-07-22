import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AccionAuditoria } from '../comun/aop/accion-auditoria.enum';
import { Auditar } from '../comun/aop/auditar.decorator';
import { ActualizarEtiquetasTareaInput } from './dto/actualizar-etiquetas-tarea.input';
import { ActualizarTareaInput } from './dto/actualizar-tarea.input';
import { AsignarUsuarioTareaInput } from './dto/asignar-usuario-tarea.input';
import { CambiarEstadoTareaInput } from './dto/cambiar-estado-tarea.input';
import { CrearTareaInput } from './dto/crear-tarea.input';
import { Tarea } from './entities/tarea.entity';
import { TareasService } from './tareas.service';

/**
 * Expone las consultas y mutaciones GraphQL relacionadas con tareas.
 */
@Resolver(() => Tarea)
export class TareasResolver {
  constructor(private readonly tareasService: TareasService) {}

  /**
   * Consulta todas las tareas.
   *
   * @returns Lista de tareas registradas.
   */
  @Query(() => [Tarea], {
    name: 'tareas',
    description: 'Obtiene todas las tareas registradas',
  })
  obtenerTareas(): Promise<Tarea[]> {
    return this.tareasService.obtenerTodas();
  }

  /**
   * Consulta una tarea por su identificador.
   *
   * @param id Identificador único de la tarea.
   * @returns Tarea encontrada.
   */
  @Query(() => Tarea, {
    name: 'tarea',
    description: 'Obtiene una tarea por su identificador',
  })
  obtenerTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<Tarea> {
    return this.tareasService.obtenerPorId(id);
  }

  /**
   * Registra una tarea.
   *
   * @param input Datos necesarios para crear la tarea.
   * @returns Tarea creada.
   */
  @Mutation(() => Tarea, {
    name: 'crearTarea',
    description: 'Crea una nueva tarea',
  })
  @Auditar(AccionAuditoria.CREAR_TAREA)
  crearTarea(@Args('input') input: CrearTareaInput): Promise<Tarea> {
    return this.tareasService.crear(input);
  }

  /**
   * Actualiza los datos generales de una tarea.
   *
   * @param id Identificador único de la tarea.
   * @param input Datos que serán modificados.
   * @returns Tarea actualizada.
   */
  @Mutation(() => Tarea, {
    name: 'actualizarTarea',
    description: 'Actualiza los datos de una tarea',
  })
  @Auditar(AccionAuditoria.ACTUALIZAR_TAREA)
  actualizarTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: ActualizarTareaInput,
  ): Promise<Tarea> {
    return this.tareasService.actualizar(id, input);
  }

  /**
   * Cambia el estado actual de una tarea.
   *
   * @param id Identificador único de la tarea.
   * @param input Nuevo estado de la tarea.
   * @returns Tarea actualizada.
   */
  @Mutation(() => Tarea, {
    name: 'cambiarEstadoTarea',
    description: 'Cambia el estado de una tarea',
  })
  @Auditar(AccionAuditoria.CAMBIAR_ESTADO_TAREA)
  cambiarEstadoTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: CambiarEstadoTareaInput,
  ): Promise<Tarea> {
    return this.tareasService.cambiarEstado(id, input.estado);
  }

  /**
   * Sustituye las etiquetas de una tarea.
   *
   * @param id Identificador único de la tarea.
   * @param input Nuevas etiquetas de la tarea.
   * @returns Tarea actualizada.
   */
  @Mutation(() => Tarea, {
    name: 'actualizarEtiquetasTarea',
    description: 'Actualiza las etiquetas de una tarea',
  })
  @Auditar(AccionAuditoria.ACTUALIZAR_ETIQUETAS_TAREA)
  actualizarEtiquetasTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: ActualizarEtiquetasTareaInput,
  ): Promise<Tarea> {
    return this.tareasService.actualizarEtiquetas(id, input.etiquetas);
  }

  /**
   * Cambia el usuario responsable de una tarea.
   *
   * @param id Identificador único de la tarea.
   * @param input Nuevo usuario responsable.
   * @returns Tarea actualizada.
   */
  @Mutation(() => Tarea, {
    name: 'asignarUsuarioTarea',
    description: 'Asigna un usuario como responsable de una tarea',
  })
  @Auditar(AccionAuditoria.ASIGNAR_USUARIO_TAREA)
  asignarUsuarioTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: AsignarUsuarioTareaInput,
  ): Promise<Tarea> {
    return this.tareasService.asignarUsuario(id, input.usuarioId);
  }

  /**
   * Elimina una tarea.
   *
   * @param id Identificador único de la tarea.
   * @returns Confirmación de la eliminación.
   */
  @Mutation(() => Boolean, {
    name: 'eliminarTarea',
    description: 'Elimina una tarea registrada',
  })
  @Auditar(AccionAuditoria.ELIMINAR_TAREA)
  eliminarTarea(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<boolean> {
    return this.tareasService.eliminar(id);
  }
}
