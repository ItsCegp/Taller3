import { registerEnumType } from '@nestjs/graphql';

/**
 * Estados disponibles para una tarea.
 */
export enum EstadoTarea {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

registerEnumType(EstadoTarea, {
  name: 'EstadoTarea',
  description: 'Estado actual de una tarea',
  valuesMap: {
    BACKLOG: {
      description: 'Tarea registrada en el backlog',
    },
    TODO: {
      description: 'Tarea pendiente por comenzar',
    },
    IN_PROGRESS: {
      description: 'Tarea actualmente en desarrollo',
    },
    DONE: {
      description: 'Tarea completada',
    },
  },
});
