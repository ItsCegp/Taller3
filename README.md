# Taller 3 — API GraphQL para gestión de tareas

Servidor desarrollado con NestJS que expone una API GraphQL para administrar usuarios, proyectos y tareas de desarrollo de software.

El proyecto aplica Programación Orientada a Aspectos mediante decoradores e interceptores, utiliza GitFlow para organizar el desarrollo y sigue principios de Clean Code.

## Funcionalidades

La API permite:

* Crear, consultar, actualizar y eliminar usuarios.
* Crear, consultar, actualizar y eliminar proyectos.
* Crear, consultar, actualizar y eliminar tareas.
* Cambiar el estado de una tarea.
* Actualizar las etiquetas de una tarea.
* Cambiar el usuario responsable.
* Asociar una tarea con un proyecto.
* Auditar las operaciones que modifican tareas.
* Registrar logs de inicio, éxito y error.
* Validar los datos recibidos mediante DTO.

## Tecnologías utilizadas

* Node.js
* TypeScript
* NestJS
* GraphQL
* Apollo Server
* TypeORM
* SQLite
* Jest
* class-validator
* RxJS

## Requisitos

Antes de ejecutar el proyecto se debe tener instalado:

* Node.js 20 o superior.
* npm.
* Git.

Para comprobar las versiones:

```bash
node --version
npm --version
git --version
```

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ItsCegp/Taller3.git
```

Entrar en el proyecto:

```bash
cd Taller3
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto utilizando `.env.example` como referencia.

```env
PORT=3000
DATABASE_PATH=database.sqlite
```

También se puede crear en PowerShell con:

```powershell
Copy-Item .env.example .env
```

El archivo `.env` no debe subirse al repositorio.

## Ejecución

Ejecutar el servidor en modo desarrollo:

```bash
npm run start:dev
```

La API GraphQL estará disponible en:

```text
http://localhost:3000/graphql
```

## Modelo de datos

### Usuario

Cada usuario contiene:

* Identificador único.
* Nombre.
* Correo electrónico único.
* Fecha de creación.
* Fecha de actualización.

### Proyecto

Cada proyecto contiene:

* Identificador único.
* Nombre único.
* Descripción.
* Fecha de creación.
* Fecha de actualización.

### Tarea

Cada tarea contiene:

* Identificador único.
* Título.
* Descripción.
* Estado actual.
* Etiquetas dinámicas.
* Fecha de creación.
* Fecha de actualización.
* Usuario asignado.
* Proyecto asociado.

## Estados disponibles

Las tareas pueden tener los siguientes estados:

```text
BACKLOG
TODO
IN_PROGRESS
DONE
```

Estos valores representan:

* `BACKLOG`: tarea registrada en el backlog.
* `TODO`: tarea pendiente por comenzar.
* `IN_PROGRESS`: tarea actualmente en desarrollo.
* `DONE`: tarea completada.

## Operaciones GraphQL

### Crear un usuario

```graphql
mutation {
  crearUsuario(
    input: {
      nombre: "Carlos González"
      correo: "carlos@example.com"
    }
  ) {
    id
    nombre
    correo
    fechaCreacion
  }
}
```

### Consultar usuarios

```graphql
query {
  usuarios {
    id
    nombre
    correo
    fechaCreacion
  }
}
```

### Crear un proyecto

```graphql
mutation {
  crearProyecto(
    input: {
      nombre: "Sistema de gestión de tareas"
      descripcion: "Aplicación para administrar tareas de proyectos de software"
    }
  ) {
    id
    nombre
    descripcion
    fechaCreacion
  }
}
```

### Consultar proyectos

```graphql
query {
  proyectos {
    id
    nombre
    descripcion
  }
}
```

### Crear una tarea

Para crear una tarea deben utilizarse identificadores válidos de un usuario y un proyecto.

```graphql
mutation {
  crearTarea(
    input: {
      titulo: "Implementar autenticación"
      descripcion: "Crear el flujo de autenticación para los usuarios"
      estado: BACKLOG
      etiquetas: ["NestJS", "GraphQL", "Backend"]
      usuarioAsignadoId: "ID_DEL_USUARIO"
      proyectoId: "ID_DEL_PROYECTO"
    }
  ) {
    id
    titulo
    descripcion
    estado
    etiquetas
    fechaCreacion
    usuarioAsignado {
      id
      nombre
      correo
    }
    proyecto {
      id
      nombre
    }
  }
}
```

### Consultar tareas

```graphql
query {
  tareas {
    id
    titulo
    descripcion
    estado
    etiquetas
    fechaCreacion
    usuarioAsignado {
      id
      nombre
      correo
    }
    proyecto {
      id
      nombre
    }
  }
}
```

### Consultar una tarea

```graphql
query {
  tarea(id: "ID_DE_LA_TAREA") {
    id
    titulo
    descripcion
    estado
    etiquetas
    usuarioAsignado {
      nombre
    }
    proyecto {
      nombre
    }
  }
}
```

### Actualizar una tarea

```graphql
mutation {
  actualizarTarea(
    id: "ID_DE_LA_TAREA"
    input: {
      titulo: "Implementar autenticación de usuarios"
      descripcion: "Crear y validar el flujo completo de autenticación"
    }
  ) {
    id
    titulo
    descripcion
    estado
    etiquetas
  }
}
```

### Cambiar el estado de una tarea

```graphql
mutation {
  cambiarEstadoTarea(
    id: "ID_DE_LA_TAREA"
    input: {
      estado: IN_PROGRESS
    }
  ) {
    id
    titulo
    estado
  }
}
```

### Actualizar las etiquetas

```graphql
mutation {
  actualizarEtiquetasTarea(
    id: "ID_DE_LA_TAREA"
    input: {
      etiquetas: ["NestJS", "GraphQL", "AOP"]
    }
  ) {
    id
    etiquetas
  }
}
```

### Cambiar el usuario asignado

```graphql
mutation {
  asignarUsuarioTarea(
    id: "ID_DE_LA_TAREA"
    input: {
      usuarioId: "ID_DEL_USUARIO"
    }
  ) {
    id
    usuarioAsignado {
      id
      nombre
    }
  }
}
```

### Eliminar una tarea

```graphql
mutation {
  eliminarTarea(id: "ID_DE_LA_TAREA")
}
```

## Validaciones

La aplicación utiliza `ValidationPipe` de NestJS junto con `class-validator`.

Las validaciones incluyen:

* Correos electrónicos válidos.
* Longitud mínima y máxima de los textos.
* Identificadores con formato UUID.
* Estados pertenecientes al enum `EstadoTarea`.
* Máximo de 20 etiquetas por tarea.
* Etiquetas con una longitud máxima de 30 caracteres.
* Rechazo de propiedades no definidas en los DTO.
* Correos de usuario únicos.
* Nombres de proyecto únicos.

## Programación Orientada a Aspectos

La auditoría se implementa como una preocupación transversal utilizando:

* Un decorador personalizado `@Auditar()`.
* Metadata asociada a los resolvers.
* Un interceptor global `AuditoriaInterceptor`.
* El servicio `Reflector` de NestJS.
* `GqlExecutionContext` para acceder al contexto GraphQL.
* Observables de RxJS para registrar el resultado de cada operación.

El decorador recibe una acción y devuelve otro decorador, por lo que también funciona como una función de orden superior.

La acción recibida se conserva mediante una clausura hasta que el interceptor consulta la metadata.

Ejemplo:

```typescript
@Mutation(() => Tarea)
@Auditar(AccionAuditoria.CAMBIAR_ESTADO_TAREA)
cambiarEstadoTarea(): Promise<Tarea> {
  // Operación delegada al servicio.
}
```

La lógica de auditoría permanece fuera del resolver y del servicio de tareas, respetando la separación de responsabilidades.

## Logs del servidor

El interceptor registra tres tipos de eventos:

```text
INICIO
EXITO
ERROR
```

Ejemplo de inicio:

```json
{
  "evento": "INICIO",
  "accion": "CAMBIAR_ESTADO_TAREA",
  "resolver": "cambiarEstadoTarea",
  "identificador": "ID_DE_LA_TAREA",
  "camposEntrada": ["estado"]
}
```

Ejemplo de operación exitosa:

```json
{
  "evento": "EXITO",
  "accion": "CAMBIAR_ESTADO_TAREA",
  "resolver": "cambiarEstadoTarea",
  "identificador": "ID_DE_LA_TAREA",
  "duracionMs": 5
}
```

Ejemplo de error:

```json
{
  "evento": "ERROR",
  "accion": "CAMBIAR_ESTADO_TAREA",
  "resolver": "cambiarEstadoTarea",
  "identificador": "ID_DE_LA_TAREA",
  "duracionMs": 3,
  "mensaje": "No se encontró una tarea con el identificador indicado"
}
```

Los logs no almacenan todos los valores recibidos. Solamente registran los nombres de los campos de entrada para evitar exponer datos innecesarios.

## Clean Code

El proyecto aplica los siguientes criterios:

* Separación entre entidades, DTO, servicios, resolvers y módulos.
* Resolvers delgados.
* Reglas de negocio dentro de los servicios.
* Nombres descriptivos.
* Métodos con una responsabilidad concreta.
* Validaciones centralizadas.
* Manejo de errores mediante excepciones de NestJS.
* Eliminación de lógica repetida.
* Uso de enums para valores limitados.
* Tipado estricto sin utilizar `any`.
* Documentación JSDoc.
* Inyección de dependencias.
* Normalización de los datos antes de guardarlos.

## Documentación JSDoc

Las clases, métodos públicos, parámetros, valores de retorno y posibles excepciones se encuentran documentados mediante JSDoc.

Ejemplo:

```typescript
/**
 * Cambia el estado actual de una tarea.
 *
 * @param id Identificador de la tarea.
 * @param estado Nuevo estado.
 * @returns Tarea actualizada.
 */
async cambiarEstado(
  id: string,
  estado: EstadoTarea,
): Promise<Tarea> {
  // Implementación.
}
```

## Pruebas

Para ejecutar todas las pruebas:

```bash
npm run test
```

Para ejecutar las pruebas del servicio de tareas:

```bash
npm test -- tareas.service.spec.ts
```

Para generar el reporte de cobertura:

```bash
npm run test:cov
```

Las pruebas de `TareasService` verifican:

* Consulta de todas las tareas.
* Consulta de una tarea por identificador.
* Error cuando una tarea no existe.
* Creación de tareas.
* Normalización de etiquetas.
* Cambio de estado.
* Eliminación de tareas.

## Calidad del código

Ejecutar ESLint:

```bash
npm run lint
```

Ejecutar el formateador:

```bash
npm run format
```

## Estructura principal

```text
src/
├── comun/
│   └── aop/
│       ├── accion-auditoria.enum.ts
│       ├── auditar.decorator.ts
│       ├── auditoria.interceptor.ts
│       └── auditoria.module.ts
├── proyectos/
│   ├── dto/
│   ├── entities/
│   ├── proyectos.module.ts
│   ├── proyectos.resolver.ts
│   └── proyectos.service.ts
├── tareas/
│   ├── dto/
│   ├── entities/
│   ├── enums/
│   ├── tareas.module.ts
│   ├── tareas.resolver.ts
│   ├── tareas.service.spec.ts
│   └── tareas.service.ts
├── usuarios/
│   ├── dto/
│   ├── entities/
│   ├── usuarios.module.ts
│   ├── usuarios.resolver.ts
│   └── usuarios.service.ts
├── app.module.ts
└── main.ts
```

## GitFlow

El proyecto utiliza las siguientes ramas:

* `main`: versión estable y entregable.
* `develop`: integración de funcionalidades.
* `feature/configuracion-graphql`
* `feature/configuracion-base-datos`
* `feature/modulo-usuarios`
* `feature/modulo-proyectos`
* `feature/modulo-tareas`
* `feature/auditoria-aop`
* `feature/pruebas-servicios`
* `feature/documentacion`

Cada funcionalidad fue desarrollada en una rama independiente y posteriormente integrada en `develop` mediante commits de merge.

La versión final se integra desde `develop` hacia `main`.

## Archivos excluidos

El archivo `.gitignore` evita subir:

```text
node_modules/
dist/
coverage/
.env
database.sqlite
```

El repositorio incluye `.env.example` como plantilla de configuración.

## Autor

Carlos Eduardo González Pineda
