import { Injectable } from '@nestjs/common';

/**
 * Servicio base de la aplicación.
 */
@Injectable()
export class AppService {
  /**
   * Devuelve un mensaje simple para la ruta base.
   *
   * @returns Mensaje de bienvenida.
   */
  getHello(): string {
    return 'Hello World!';
  }
}
