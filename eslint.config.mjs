// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import-x'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

// Shared import/order rule — mirrors tripsurance-be/eslint.config.mjs so both
// repos group/sort imports identically.
/** @type {['error', Record<string, unknown>]} */
const importOrderRule = [
  'error',
  {
    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'type'],
    pathGroups: [
      // Match the @/* alias defined in tsconfig.json
      { pattern: '@/**', group: 'internal', position: 'after' },
    ],
    pathGroupsExcludedImportTypes: ['builtin'],
    alphabetize: { order: 'asc', caseInsensitive: true },
    'newlines-between': 'never',
  },
]

export default defineConfig(
  // ── Next.js + TypeScript rules ──────────────────────────────────────────────
  ...nextVitals,
  ...nextTs,

  // ── Type-aware TypeScript rules (same strictness tier as tripsurance-be) ────
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),

  // Disable rules that conflict with Prettier — MUST come after the configs above
  prettier,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // ═══════════════════════════════════════════════════════════════════════
      // Baseline — mirrors tripsurance-be/eslint.config.mjs where it applies to
      // a browser/React codebase. Node-only rules (n/*, security/*, no-process-env)
      // are intentionally left out — they don't apply here.
      // ═══════════════════════════════════════════════════════════════════════

      // ── Safety & error handling ──────────────────────────────────────────────
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      curly: ['error', 'all'],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/only-throw-error': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ],

      // ── TypeScript strictness ───────────────────────────────────────────────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/promise-function-async': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': 'off', // delegated to unused-imports below

      // ── Imports ──────────────────────────────────────────────────────────────
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'import-x/no-duplicates': 'error',
      'import-x/no-cycle': 'warn',
      // Same-folder imports use `./foo`; anything crossing a folder boundary must use the `@/` alias
      'import-x/no-relative-parent-imports': 'error',
      'import-x/order': importOrderRule,
      // Cross-feature imports go through a feature's public `index.ts`, never its internals
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message:
                'Import from another feature only via its public API (@/features/<name>), not internal paths.',
            },
          ],
        },
      ],

      // ── Console ──────────────────────────────────────────────────────────────
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // ── Tests (relaxed for mocks/fixtures — mirrors tripsurance-be) ─────────────
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': 'off',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'eslint.config.mjs'])
)
