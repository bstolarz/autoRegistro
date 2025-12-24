import { test, expect } from '@playwright/test';
import { AutoApiClient } from '../../api/AutoApiClient';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { TestHelpers } from '../../utils/TestHelpers';
import { ListadoPage } from '../../pages/ListadoPage';
import { CrearAutoPage } from '../../pages/CrearAutoPage';

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

  test('Puedo crear un auto via API con datos validos', async ({ page, request }) => {
    const testData = AutoFormDataProvider.getValidData();
    // Fill all form fields
    await createAutoPage.fillForm(testData);
    // Submit the form
    await createAutoPage.submitForm();
    //Consultar por API que el dato haya modificado y se haya guardado correctamente
    const autoId = await ListadoPage.getAutoIdByChasis(page, testData.numeroChasis!);
    console.log('xxx____autoId value', autoId);
    // Consultar por API que el Auto se haya guardado correctamente
    const apiClient = new AutoApiClient(request);
    const responseGet = await apiClient.getAutoById(autoId);
    // Assertions
    const isSaved = await apiClient.validateAutoCreado(responseGet, testData);
    expect(isSaved, 'Auto no guardado').toBeTruthy();
  });
});

