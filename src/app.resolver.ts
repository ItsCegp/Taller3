import { Query, Resolver } from '@nestjs/graphql';

/**
 * Resolver de estado para verificar que la API GraphQL responde.
 */
@Resolver()
export class HealthResolver {
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
