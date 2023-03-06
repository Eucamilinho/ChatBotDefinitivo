
// Código refactorizado:
import { v4 as uuid } from "uuid";

export class Lead {
  readonly uuid: string;
  readonly message: string;
  readonly phone: string;

  constructor({ message, phone }: { message: string; phone: string }) {
    this.uuid = uuid();
    this.message = message;
    this.phone = phone;
  }
}
// El código refactorizado elimina la desestructuración de los parámetros en el constructor,
// y en su lugar pasa los parámetros directamente. Esto hace que el código sea más simple y más
// legible.