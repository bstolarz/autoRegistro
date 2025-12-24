import { test, expect } from '@playwright/test';
import { AutoApiClient } from '../../api/AutoApiClient';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { TestHelpers } from '../../utils/TestHelpers';
import { ListadoPage } from '../../pages/ListadoPage';

/**
 * API Tests for Auto endpoints
 * Tests the API endpoints related to Auto operations
 */
test.describe('Auto API Tests', () => {
  let apiClient: AutoApiClient;
  let listadoPage: ListadoPage;

  test.beforeEach(async ({ request }) => {
    apiClient = new AutoApiClient(request);
    listadoPage = new ListadoPage(page);
  });

  test('Puedo crear un auto via API con datos validos', async ({ request }) => {
    const testData = AutoFormDataProvider.getValidData();
    const response = await apiClient.createAuto(testData);
    
    // Verificar response status
    expect(response.status(), 'El estado de la respuesta es incorrecto').toBeGreaterThanOrEqual(200);
    expect(response.status(), 'El estado de la respuesta es incorrecto').toBeLessThan(300);
    
    // Verificar response body
    const responseBody = await response.text();
    expect(responseBody).toBeDefined();
    
    const autoId = 1;
    // *** Consultar por API que el dato haya modificado y se haya guardado correctamente
    const apiClient = new AutoApiClient(request);
    const response2 = await apiClient.getAutoById(autoId);
    const responseCar = TestHelpers.getJsonFromHtmlResponse(response);

    expect((await responseCar).marca, 'Marca no modificada').toBe(newMarcaValue);
    await page.waitForTimeout(2000);

    // Validar que se hayan guardado los datos correctamente                                                                  
    const isValid = await apiClient.validateCreateResponse(response, testData);
    expect(isValid).toBe(true);
  });

  test('should get all autos', async () => {
    const response = await apiClient.getAllAutos();
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(300);
    
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
  });

  test('should create multiple autos via API', async () => {
    const dataSets = AutoFormDataProvider.getValidDataSets();
    
    for (const data of dataSets) {
      const response = await apiClient.createAuto(data);
      
      expect(response.status()).toBeGreaterThanOrEqual(200);
      expect(response.status()).toBeLessThan(300);
      
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
    }
  });

  test('should handle API request with missing required fields', async () => {
    const invalidData: any = {
      marca: 'Toyota',
      // Missing other required fields
    };
    
    const response = await apiClient.createAuto(invalidData);
    
    // API should return error status (400 or 422)
    console.log('xxx____response', response);
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('should validate response structure for created auto', async () => {
    const testData = AutoFormDataProvider.getValidData();
    
    const response = await apiClient.createAuto(testData);
    
    if (TestHelpers.isSuccessResponse(response.status())) {
      const responseBody = await response.json();
      
      // Verify response has expected structure
      expect(responseBody).toHaveProperty('marca');
      expect(responseBody).toHaveProperty('modelo');
      expect(responseBody).toHaveProperty('numeroChasis');
      
      // Verify data matches
      if (responseBody.marca) {
        expect(responseBody.marca).toBe(testData.marca);
      }
    }
  });

  test('should handle API request with special characters', async () => {
    const testData = AutoFormDataProvider.getSpecialCharactersData();
    
    const response = await apiClient.createAuto(testData);
    
    // Should handle special characters (may succeed or fail depending on API validation)
    expect([200, 201, 400, 422]).toContain(response.status());
  });

  test('should create auto with random generated data', async () => {
    const randomData = AutoFormDataProvider.generateRandomData();
    
    const response = await apiClient.createAuto(randomData);
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);
    
    if (TestHelpers.isSuccessResponse(response.status())) {
      const responseBody = await response.json();
      expect(responseBody).toBeDefined();
    }
  });

  test('should verify API response headers', async () => {
    const testData = AutoFormDataProvider.getValidData();
    
    const response = await apiClient.createAuto(testData);
    
    const headers = response.headers();
    expect(headers).toBeDefined();
    
    // Check for content-type header
    if (headers['content-type']) {
      expect(headers['content-type']).toContain('application/json');
    }
  });
});

