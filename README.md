# Gampix Offline Project - Test Framework

Test framework que usa Playwright y Typescript, con Patron Page object Model (POM), herencia, Modul de Data Provider, y classes Model para testear UI y API.


## Instalacion

1. Instalar dependencias:
```bash
npm install
```

2. Instalar Playwright browsers:
```bash
npx playwright install
```

## Correr Tests

### Correr todos los tests
```bash
npm test
```

### Correr solo tests de UI
```bash
npm run test:ui-tests
```

### Correr solo tests de API
```bash
npm run test:api
```

### Ver test report
```bash
npm run report
```

## Cobertura de Test

### UI Tests
- **Create Auto Tests** (`create-auto-tests.spec.ts`):
  - Form display validation
  - Form submission with valid data
  - Form submission with different estados (Nuevo/Usado)
  - Form validation
  - Navigation tests
  - Special characters handling
  - Verify auto saved in list

- **Modify Auto Tests** (`modificar-auto-tests.spec.ts`):
  - Form pre-fill validation
  - Modify auto fields
  - Verify changes saved via API

### API Tests
- **Create Auto API** (`api-create-auto.spec.ts`):
  - Create auto via API with valid data
  - Verify auto created and saved correctly
  - HTML response parsing and validation

## Configuracion

URLs del framework:
- **API URL**: https://frontend.wildar.dev
- **Web URL**: https://frontend.wildar.dev


