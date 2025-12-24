import { AutoApiClient } from '../../api/AutoApiClient';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { TestHelpers } from '../../utils/TestHelpers';
import { ListadoPage } from '../../pages/ListadoPage';
import { CrearAutoPage } from '../../pages/CrearAutoPage';
import { CarPage } from '../../pages/CarPage.js';
import { test, expect } from '../../fixture/carPageFixture.js';

/**
 * API Tests for Auto endpoints
 * Tests the API endpoints related to Auto operations
 */
test.describe('Auto API Tests', () => {
  let apiClient: AutoApiClient;
  let listadoPage: ListadoPage;
  let createAutoPage: CrearAutoPage;

  test.beforeEach(async ({ page, request }) => {
    apiClient = new AutoApiClient(request);
    listadoPage = new ListadoPage(page);
    createAutoPage = new CrearAutoPage(page);
    await createAutoPage.goto();
  });

  test('Puedo crear un auto via API con datos validos', async ({ page, request, carPage }) => {
    const testData = AutoFormDataProvider.getValidData();
    await createAutoPage.fillForm(testData);
    await createAutoPage.submitForm();
    const autoId = await ListadoPage.getAutoIdByChasis(page, testData.numeroChasis!);
    const responseGet = await AutoApiClient.getAutoById(request, autoId);
    await page.setContent(await responseGet.text());
    expect(await carPage.getMarca(), 'Marca no guardada').toBe(testData.marca);
    expect(await carPage.getModelo(), 'Modelo no guardado').toBe(testData.modelo);
    expect(await carPage.getNumeroChasis(), 'Número de Chasis no guardado').toBe(testData.numeroChasis);
  });
});

