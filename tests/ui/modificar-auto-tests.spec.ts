import { test, expect } from '@playwright/test';
import { ModificarAutoPage } from '../../pages/modificarAutoPage';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { AutoApiClient } from '../../api/AutoApiClient';
import { TestHelpers } from '../../utils/TestHelpers';

/**
 * UI Tests for Modificar Auto Form
 * Tests the form at https://frontend.wildar.dev/Autos/Modificar/{id}
 */

test.describe('Modificar Auto Form - UI Tests', () => {
    let modificarAutoPage: ModificarAutoPage;

    test.beforeEach(async ({ page }) => {
        modificarAutoPage = new ModificarAutoPage(page);
        // Navigate to modify page - you may need to provide an actual auto ID
        // or navigate from a list page first
        await modificarAutoPage.goto();
      });

    test('Modificar un auto', async ({page, request}) => {
        // Verificar que el Auto se cargue correctamente en pagina Editar
        const isPreFilled = await modificarAutoPage.verifyFormPreFilled();
        expect(isPreFilled, 'Form is not pre-filled').toBe(true);
        
          // Obtener el auto ID de la URL (e.g., /Autos/Modificar/123)
          const url = page.url();
          const autoId = url.split('/').pop() || '';
          
        // Modificar el año del Auto
        const marcaValue = await modificarAutoPage.marcaInput.inputValue();
        const newMarcaValue = marcaValue + 'TEST';
        await modificarAutoPage.modifyFields({ marca: newMarcaValue });
        await modificarAutoPage.submitForm();
        await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));
        
        // Consultar por API que el dato haya modificado y se haya guardado correctamente
        const apiClient = new AutoApiClient(request);
        const response = await apiClient.getAutoById(autoId);
        const responseCar = TestHelpers.getJsonFromHtmlResponse(response);
  
        expect((await responseCar).marca, 'Marca no modificada').toBe(newMarcaValue);
        await page.waitForTimeout(2000);
    });
});