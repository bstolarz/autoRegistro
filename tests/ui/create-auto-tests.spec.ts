import { test, expect } from '@playwright/test';
import { CrearAutoPage } from '../../pages/CrearAutoPage';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { AutoApiClient } from '../../api/AutoApiClient';
import { ListadoPage } from '../../pages/ListadoPage';
import { TestHelpers } from '../../utils/TestHelpers';

/**
 * UI Tests Para Sistema de Gestion de Autos
 * Testear Agregar auto en https://frontend.wildar.dev/Autos/Crear
 */
test.describe('Agregar Auto - UI Tests', () => {
  let autoFormPage: CrearAutoPage;
  test.beforeEach(async ({ page }) => {
    autoFormPage = new CrearAutoPage(page);
    await autoFormPage.goto();
  });

  test('Agregar un auto', async ( {page, request} ) => {
    const testData = AutoFormDataProvider.getValidData();
    await autoFormPage.fillForm(testData);
    await autoFormPage.submitForm();
    await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));
    await TestHelpers.verifyAutoSavedInUI(page, testData.numeroChasis!, 'Auto no guardado');
    await page.waitForTimeout(2000);
  });
});

