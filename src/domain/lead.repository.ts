// Código refactorizado:
import { Lead } from "./lead";

/**
 * Esta la interfaz que debe de cumplir el repositorio de infraestructura
 * mysql o mongo o etc
 */
export default interface LeadRepository {
  save({
    message,
    phone,
  }: {
    message: string;
    phone: string;
  }): Promise<Lead | undefined | null>;
  getDetail(id:string):Promise<Lead | null | undefined>
}

// Explicación: el código se ha refactorizado para usar el tipo de cliente potencial
//en lugar de pasar un objeto con propiedades de mensaje y teléfono.
//Esto reduce la cantidad de código necesario para guardar un cliente potencial, ya que el repositorio
// ahora solo necesita tomar un solo parámetro. El método getDetail también tiene
// ha sido actualizado para tomar una identificación en lugar de un objeto.