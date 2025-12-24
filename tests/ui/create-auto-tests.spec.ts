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

  test('should display the form correctly', async () => {
    // Verify form is visible
    await expect(autoFormPage.isFormVisible()).resolves.toBe(true);
    await expect(autoFormPage.marcaInput).toBeVisible();
    await expect(autoFormPage.modeloInput).toBeVisible();
    await expect(autoFormPage.numeroChasisInput).toBeVisible();
    await expect(autoFormPage.añoInput).toBeVisible();
    await expect(autoFormPage.precioInput).toBeVisible();
    await expect(autoFormPage.colorInput).toBeVisible();
    await expect(autoFormPage.estadoSelect).toBeVisible();
  });

  test('should fill and submit form with valid data', async ({ page }) => {
    const testData = AutoFormDataProvider.getValidData();
    
    // Fill the form
    await autoFormPage.fillForm(testData);
    
    // Verify form values are filled correctly
    const formValues = await autoFormPage.getFormValues();
    expect(formValues.marca).toBe(testData.marca);
    expect(formValues.modelo).toBe(testData.modelo);
    expect(formValues.numeroChasis).toBe(testData.numeroChasis);
    
    // Submit the form
    await autoFormPage.submitForm();
    
    // Wait for navigation or success message
    // Adjust these assertions based on actual behavior after submission
    await page.waitForTimeout(2000);
    
    // Verify we're no longer on the form page or check for success message
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/Autos/Crear');
  });

  test.only('Agregar un auto', async ( {page, request} ) => {
    const testData = AutoFormDataProvider.getValidData();
    // Fill all form fields
    await autoFormPage.fillForm(testData);
    // Submit the form
    await autoFormPage.submitForm();
    // Consultar en el listado que el Auto se haya guardado correctamente
    await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));
    // Consultar por UI que el Auto se haya guardado correctamente
    await TestHelpers.verifyAutoSavedInUI(page, testData.numeroChasis!, 'Auto no guardado');
    await page.waitForTimeout(2000);
  });
});

