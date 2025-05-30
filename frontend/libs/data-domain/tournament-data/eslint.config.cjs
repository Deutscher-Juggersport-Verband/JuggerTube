const nx = require('@nx/eslint-plugin');

module.exports = [
  {
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: { constructors: 'no-public' },
        },
      ],
      'simple-import-sort/imports': [
        1,
        {
          groups: [
            ['zone\\.js\\/?', '@?jest(\\/|-)'],
            ['^@angular\\/'],
            ['^@angular\\/material'],
            ['^rxjs\\/?'],
            ['^@?ngrx\\/?', '^ngrx-store-localstorage'],
            [
              '^date-fns\\/?',
              '^@fortawesome\\/?',
              '^jasmine',
              '^ng2-currency-mask',
              '^ngx-cookie',
              '^ngx-logger',
              '^text-mask-addons\\/?',
              '^@maskito\\/?',
            ],
            ['\/business-rules\/', '\/data-domain\/', '\/infrastructure\/'],
            ['\/environments\/environment'],
            ['app\.component', 'app\.module', 'app-routing\.module'],
          ],
        },
      ],
      'no-extra-semi': 'off',
      'quotes': ['error', 'single'],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.js'],
    ...require('@nx/eslint-plugin').configs.javascript,
    rules: {
      'no-extra-semi': 'off',
    },
  },
  {
    files: ['**/*.html'],
    ...require('@angular-eslint/eslint-plugin-template').configs.recommended,
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ['error'],
      '@typescript-eslint/ban-ts-comment': ['off'],
    },
  },
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
];
