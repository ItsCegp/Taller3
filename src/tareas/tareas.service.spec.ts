import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { ProyectosService } from '../proyectos/proyectos.service';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { EstadoTarea } from './enums/estado-tarea.enum';
import { Tarea } from './entities/tarea.entity';
import { TareasService } from './tareas.service';

type RepositorioTareasMock = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
};

type UsuariosServiceMock = {
  obtenerPorId: jest.Mock;
};

type ProyectosServiceMock = {
  obtenerPorId: jest.Mock;
};

describe('TareasService', () => {
  let tareasService: TareasService;
  let tareasRepository: RepositorioTareasMock;
  let usuariosService: UsuariosServiceMock;
  let proyectosService: ProyectosServiceMock;

  const fechaPrueba = new Date('2026-07-22T22:57:29.000Z');

  const crearUsuario = (): Usuario =>
    ({
      id: '2692c8d4-3073-443d-8b28-6cc07ad11521',
      nombre: 'Carlos Eduardo González',
      correo: 'carlos@example.com',
      fechaCreacion: fechaPrueba,
      fechaActualizacion: fechaPrueba,
    }) as Usuario;

  const crearProyecto = (): Proyecto =>
    ({
      id: '12283ed6-9496-4f65-b0f5-79c20f8e4cf5',
      nombre: 'Sistema de gestión de tareas',
      descripcion: 'Aplicación para administrar tareas de software',
      fechaCreacion: fechaPrueba,
      fechaActualizacion: fechaPrueba,
    }) as Proyecto;

  const crearTarea = (estado: EstadoTarea = EstadoTarea.BACKLOG): Tarea =>
    ({
      id: 'd24706d8-35bb-490c-a913-1e6910f2d4e2',
      titulo: 'Implementar autenticación',
      descripcion: 'Crear el flujo de autenticación para los usuarios',
      estado,
      etiquetas: ['NestJS', 'GraphQL'],
      fechaCreacion: fechaPrueba,
      fechaActualizacion: fechaPrueba,
      usuarioAsignado: crearUsuario(),
      proyecto: crearProyecto(),
    }) as Tarea;

  beforeEach(async () => {
    tareasRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    usuariosService = {
      obtenerPorId: jest.fn(),
    };

    proyectosService = {
      obtenerPorId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareasService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: tareasRepository,
        },
        {
          provide: UsuariosService,
          useValue: usuariosService,
        },
        {
          provide: ProyectosService,
          useValue: proyectosService,
        },
      ],
    }).compile();

    tareasService = module.get<TareasService>(TareasService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('obtenerTodas', () => {
    it('debe retornar todas las tareas con sus relaciones', async () => {
      const tareas = [crearTarea()];

      tareasRepository.find.mockResolvedValue(tareas);

      const resultado = await tareasService.obtenerTodas();

      expect(resultado).toEqual(tareas);
      expect(tareasRepository.find).toHaveBeenCalledWith({
        relations: {
          usuarioAsignado: true,
          proyecto: true,
        },
        order: {
          fechaCreacion: 'DESC',
        },
      });
    });
  });

  describe('obtenerPorId', () => {
    it('debe retornar una tarea existente', async () => {
      const tarea = crearTarea();

      tareasRepository.findOne.mockResolvedValue(tarea);

      const resultado = await tareasService.obtenerPorId(tarea.id);

      expect(resultado).toEqual(tarea);
      expect(tareasRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: tarea.id,
        },
        relations: {
          usuarioAsignado: true,
          proyecto: true,
        },
      });
    });

    it('debe lanzar NotFoundException cuando la tarea no existe', async () => {
      tareasRepository.findOne.mockResolvedValue(null);

      await expect(
        tareasService.obtenerPorId('00000000-0000-4000-8000-000000000000'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('crear', () => {
    it('debe crear una tarea y normalizar sus datos', async () => {
      const usuario = crearUsuario();
      const proyecto = crearProyecto();
      const tarea = crearTarea();

      usuariosService.obtenerPorId.mockResolvedValue(usuario);
      proyectosService.obtenerPorId.mockResolvedValue(proyecto);
      tareasRepository.create.mockReturnValue(tarea);
      tareasRepository.save.mockResolvedValue(tarea);
      tareasRepository.findOne.mockResolvedValue(tarea);

      const resultado = await tareasService.crear({
        titulo: '  Implementar autenticación  ',
        descripcion: '  Crear el flujo de autenticación para los usuarios  ',
        estado: EstadoTarea.BACKLOG,
        etiquetas: ['NestJS', 'nestjs', '  GraphQL  '],
        usuarioAsignadoId: usuario.id,
        proyectoId: proyecto.id,
      });

      expect(usuariosService.obtenerPorId).toHaveBeenCalledWith(usuario.id);

      expect(proyectosService.obtenerPorId).toHaveBeenCalledWith(proyecto.id);

      expect(tareasRepository.create).toHaveBeenCalledWith({
        titulo: 'Implementar autenticación',
        descripcion: 'Crear el flujo de autenticación para los usuarios',
        estado: EstadoTarea.BACKLOG,
        etiquetas: ['NestJS', 'GraphQL'],
        usuarioAsignado: usuario,
        proyecto,
      });

      expect(tareasRepository.save).toHaveBeenCalledWith(tarea);
      expect(resultado).toEqual(tarea);
    });
  });

  describe('cambiarEstado', () => {
    it('debe modificar el estado de una tarea existente', async () => {
      const tareaBacklog = crearTarea(EstadoTarea.BACKLOG);
      const tareaCompletada = crearTarea(EstadoTarea.DONE);

      tareasRepository.findOne
        .mockResolvedValueOnce(tareaBacklog)
        .mockResolvedValueOnce(tareaCompletada);

      tareasRepository.save.mockResolvedValue(tareaCompletada);

      const resultado = await tareasService.cambiarEstado(
        tareaBacklog.id,
        EstadoTarea.DONE,
      );

      expect(tareaBacklog.estado).toBe(EstadoTarea.DONE);
      expect(tareasRepository.save).toHaveBeenCalledWith(tareaBacklog);
      expect(resultado.estado).toBe(EstadoTarea.DONE);
    });
  });

  describe('eliminar', () => {
    it('debe eliminar una tarea existente', async () => {
      const tarea = crearTarea();

      tareasRepository.findOne.mockResolvedValue(tarea);
      tareasRepository.remove.mockResolvedValue(tarea);

      const resultado = await tareasService.eliminar(tarea.id);

      expect(tareasRepository.remove).toHaveBeenCalledWith(tarea);
      expect(resultado).toBe(true);
    });
  });
});
