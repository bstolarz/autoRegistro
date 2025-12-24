/**
 * Car Model
 * Represents a car entity with all its properties
 */
export class Car {
  id?: string | number;
  marca?: string;
  modelo?: string;
  numeroChasis?: string;
  año?: number;
  precio?: number;
  color?: string;
  estado?: 'Nuevo' | 'Usado';

  constructor(data?: Partial<Car>) {
    if (data) {
      this.id = data.id;
      this.marca = data.marca;
      this.modelo = data.modelo;
      this.numeroChasis = data.numeroChasis;
      this.año = data.año;
      this.precio = data.precio;
      this.color = data.color;
      this.estado = data.estado;
    }
  }
}

