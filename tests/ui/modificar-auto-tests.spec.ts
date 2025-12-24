import { test, expect } from '@playwright/test';
import { ModificarAutoPage } from '../../pages/modificarAutoPage';
import { AutoFormDataProvider } from '../../data/AutoFormDataProvider';
import { AutoApiClient } from '../../api/AutoApiClient';
import { TestHelpers } from '../../utils/TestHelpers';

/**
 * UI Tests Para Sistema de Gestion de Autos
 * Modificar Auto en https://frontend.wildar.dev/Autos/Modificar/{id}
 */

test.describe('Modificar Auto Form - UI Tests', () => {
    let modificarAutoPage: ModificarAutoPage;
    test.beforeEach(async ({ page }) => {
        modificarAutoPage = new ModificarAutoPage(page);
        await modificarAutoPage.goto();
      });

    test('Modificar un auto', async ({page, request}) => {
        const isPreFilled = await modificarAutoPage.verifyFormPreFilled();
        expect(isPreFilled, 'Form is not pre-filled').toBe(true);
        const autoId = TestHelpers.getAutoIdFromUrl(page);
        const marcaValue = await modificarAutoPage.marcaInput.inputValue();
        const newMarcaValue = marcaValue + 'TEST';
        await modificarAutoPage.modifyFields({ marca: newMarcaValue });
        await modificarAutoPage.submitForm();
        await expect(page, 'No se redirigio a la pagina de listado de autos').toHaveURL(new RegExp(`/Autos`));
        const response = await AutoApiClient.getAutoById(request, autoId);
        const responseCar = TestHelpers.getJsonFromHtmlResponse(response);
        expect((await responseCar).marca, 'Marca no modificada').toBe(newMarcaValue);
        await page.waitForTimeout(2000);
    });
});