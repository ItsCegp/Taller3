import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ActualizarProyectoInput } from './dto/actualizar-proyecto.input';
import { CrearProyectoInput } from './dto/crear-proyecto.input';
import { Proyecto } from './entities/proyecto.entity';
import { ProyectosService } from './proyectos.service';

/**
 * Expone las consultas y mutaciones GraphQL relacionadas con proyectos.
 */
@Resolver(() => Proyecto)
export class ProyectosResolver {
  constructor(private readonly proyectosService: ProyectosService) {}

  /**
   * Consulta todos los proyectos registrados.
   *
   * @returns Lista de proyectos.
   */
  @Query(() => [Proyecto], {
    name: 'proyectos',
    description: 'Obtiene todos los proyectos registrados',
  })
  obtenerProyectos(): Promise<Proyecto[]> {
    return this.proyectosService.obtenerTodos();
  }

  /**
   * Consulta un proyecto por su identificador.
   *
   * @param id Identificador único del proyecto.
   * @returns Proyecto encontrado.
   */
  @Query(() => Proyecto, {
    name: 'proyecto',
    description: 'Obtiene un proyecto por su identificador',
  })
  obtenerProyecto(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<Proyecto> {
    return this.proyectosService.obtenerPorId(id);
  }

  /**
   * Registra un proyecto.
   *
   * @param input Datos del nuevo proyecto.
   * @returns Proyecto creado.
   */
  @Mutation(() => Proyecto, {
    name: 'crearProyecto',
    description: 'Crea un nuevo proyecto',
  })
  crearProyecto(@Args('input') input: CrearProyectoInput): Promise<Proyecto> {
    return this.proyectosService.crear(input);
  }

  /**
   * Modifica los datos de un proyecto.
   *
   * @param id Identificador único del proyecto.
   * @param input Datos que serán modificados.
   * @returns Proyecto actualizado.
   */
  @Mutation(() => Proyecto, {
    name: 'actualizarProyecto',
    description: 'Actualiza los datos de un proyecto',
  })
  actualizarProyecto(
    @Args('id', {
      type: () => ID,
    })
    id: string,
    @Args('input') input: ActualizarProyectoInput,
  ): Promise<Proyecto> {
    return this.proyectosService.actualizar(id, input);
  }

  /**
   * Elimina un proyecto.
   *
   * @param id Identificador único del proyecto.
   * @returns Confirmación de la eliminación.
   */
  @Mutation(() => Boolean, {
    name: 'eliminarProyecto',
    description: 'Elimina un proyecto registrado',
  })
  eliminarProyecto(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ): Promise<boolean> {
    return this.proyectosService.eliminar(id);
  }
}
