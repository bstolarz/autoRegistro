import { TestHelpers } from '../utils/TestHelpers';
/**
 * Data Provider Module for Auto Form Test Data
 * Provides test data for form submission tests
 */

export interface AutoFormData {
  marca?: string;
  modelo?: string;
  numeroChasis?: string;
  año?: number;
  precio?: number;
  color?: string;
  estado?: 'Nuevo' | 'Usado';
}

export class AutoFormDataProvider {
  /**
   * Get valid test data for form submission
   */
  static getValidData(): AutoFormData {
    return {
      marca: 'Bren_Toyota_API',
      modelo: 'Corolla',
      numeroChasis: TestHelpers.generateUniqueChasis(),
      año: 2023,
      precio: 25000,
      color: 'Blanco',
      estado: 'Nuevo',
    };
  }

  /**
   * Get multiple valid test data sets
   */
  static getValidDataSets(): AutoFormData[] {
    return [
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        numeroChasis: `CH${Date.now()}-1`,
        año: 2023,
        precio: 25000,
        color: 'Blanco',
        estado: 'Nuevo',
      },
      {
        marca: 'Honda',
        modelo: 'Civic',
        numeroChasis: `CH${Date.now()}-2`,
        año: 2022,
        precio: 22000,
        color: 'Negro',
        estado: 'Usado',
      },
      {
        marca: 'Ford',
        modelo: 'Focus',
        numeroChasis: `CH${Date.now()}-3`,
        año: 2021,
        precio: 18000,
        color: 'Rojo',
        estado: 'Usado',
      },
    ];
  }

  /**
   * Get invalid test data (missing required fields)
   */
  static getInvalidData(): AutoFormData[] {
    return [
      {
        // Missing marca
        modelo: 'Corolla',
        año: 2023,
        precio: 25000,
      },
      {
        marca: 'Toyota',
        // Missing modelo
        año: 2023,
        precio: 25000,
      },
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        // Missing año
        precio: 25000,
      },
    ];
  }

  /**
   * Get edge case test data
   */
  static getEdgeCaseData(): AutoFormData[] {
    return [
      {
        marca: 'A',
        modelo: 'B',
        numeroChasis: '1',
        año: 1900,
        precio: 0,
        color: 'X',
        estado: 'Nuevo',
      },
      {
        marca: 'Very Long Brand Name That Exceeds Normal Limits',
        modelo: 'Very Long Model Name That Exceeds Normal Limits',
        numeroChasis: 'CH' + 'A'.repeat(100),
        año: 9999,
        precio: 999999999,
        color: 'Very Long Color Name',
        estado: 'Usado',
      },
      {
        marca: 'Toyota',
        modelo: 'Corolla',
        numeroChasis: `CH${Date.now()}`,
        año: new Date().getFullYear() + 1, // Future year
        precio: -1000, // Negative price
        color: 'Blanco',
        estado: 'Nuevo',
      },
    ];
  }

  /**
   * Get data with special characters
   */
  static getSpecialCharactersData(): AutoFormData {
    return {
      marca: "Toyota's",
      modelo: 'Corolla-X&Y',
      numeroChasis: `CH-${Date.now()}_@#$`,
      año: 2023,
      precio: 25000.99,
      color: 'Blanco/Negro',
      estado: 'Nuevo',
    };
  }

  /**
   * Generate random valid data
   */
  static generateRandomData(): AutoFormData {
    const marcas = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen'];
    const modelos = ['Corolla', 'Civic', 'Focus', 'Cruze', 'Sentra', 'Jetta'];
    const colores = ['Blanco', 'Negro', 'Rojo', 'Azul', 'Gris', 'Plateado'];
    const estados: ('Nuevo' | 'Usado')[] = ['Nuevo', 'Usado'];

    const randomMarca = marcas[Math.floor(Math.random() * marcas.length)];
    const randomModelo = modelos[Math.floor(Math.random() * modelos.length)];
    const randomColor = colores[Math.floor(Math.random() * colores.length)];
    const randomEstado = estados[Math.floor(Math.random() * estados.length)];

    return {
      marca: randomMarca,
      modelo: randomModelo,
      numeroChasis: `CH${Date.now()}${Math.floor(Math.random() * 1000)}`,
      año: 2015 + Math.floor(Math.random() * 10),
      precio: 15000 + Math.floor(Math.random() * 20000),
      color: randomColor,
      estado: randomEstado,
    };
  }
}

