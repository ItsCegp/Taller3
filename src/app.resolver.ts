import { Query, Resolver } from '@nestjs/graphql';

/**
 * Resolver principal para verificar el funcionamiento de GraphQL.
 */
@Resolver()
export class AppResolver {
  /**
   * Devuelve un mensaje de confirmación.
   *
   * @returns Mensaje que confirma que la API está funcionando.
   */
  @Query(() => String, {
    description: 'Comprueba que la API GraphQL está funcionando',
  })
  saludo(): string {
    return 'API GraphQL funcionando correctamente';
  }
}
