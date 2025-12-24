# Gampix Offline Project - Test Framework

A comprehensive test framework using Playwright and TypeScript with Page Object Model (POM) design pattern and Data Provider module for testing both API and UI.

## Project Structure

```
gampixOfflineProject/
├── pages/              # Page Object Model classes
│   └── CrearAutoPage.ts
├── tests/              # Test files
│   ├── ui/            # UI tests
│   │   └── autoForm.spec.ts
│   └── api/           # API tests
│       └── autoApi.spec.ts
├── data/              # Data Provider module
│   └── AutoFormDataProvider.ts
├── api/               # API client utilities
│   └── AutoApiClient.ts
├── utils/             # Helper utilities
│   └── TestHelpers.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Features

- **Page Object Model (POM)**: Organized page objects for maintainable UI tests
- **Data Provider Module**: Centralized test data management
- **API Testing**: Comprehensive API test utilities
- **TypeScript**: Full type safety and modern JavaScript features
- **Playwright**: Fast and reliable end-to-end testing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run UI tests only
```bash
npm run test:ui-tests
```

### Run API tests only
```bash
npm run test:api
```

### Run tests in headed mode
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Debug tests
```bash
npm run test:debug
```

### View test report
```bash
npm run report
```

## Test Coverage

### UI Tests
- Form display validation
- Form submission with valid data
- Form submission with different estados (Nuevo/Usado)
- Form validation
- Navigation tests
- Special characters handling

### API Tests
- Create auto via API
- Get all autos
- Response validation
- Error handling
- Special characters handling

## Configuration

The framework is configured to test:
- **Base URL**: https://frontend.wildar.dev
- **Test URL**: https://frontend.wildar.dev/Autos/Crear

You can modify these in `playwright.config.ts` and the respective page objects.

## Data Provider

The `AutoFormDataProvider` class provides various test data sets:
- `getValidData()`: Returns valid form data
- `getValidDataSets()`: Returns multiple valid data sets
- `getInvalidData()`: Returns invalid data for negative testing
- `getEdgeCaseData()`: Returns edge case scenarios
- `getSpecialCharactersData()`: Returns data with special characters
- `generateRandomData()`: Generates random valid data

## Page Object Model

The `CrearAutoPage` class encapsulates all interactions with the Auto registration form:
- Form field interactions
- Form submission
- Navigation
- Form validation

## API Client

The `AutoApiClient` class provides methods for API interactions:
- `createAuto()`: Create a new auto
- `getAutoById()`: Get auto by ID
- `getAllAutos()`: Get all autos
- `updateAuto()`: Update an auto
- `deleteAuto()`: Delete an auto

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow POM pattern for UI tests
4. Use Data Provider for test data
5. Write descriptive test names

## License

ISC

