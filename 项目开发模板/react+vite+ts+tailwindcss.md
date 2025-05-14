```bash
npm i axios react-router
npm i tailwindcss @tailwindcss/vite @types/node eslint-config-prettier eslint-plugin-import eslint-plugin-prettier eslint-plugin-react prettier prettier-plugin-organize-imports prettier-plugin-tailwindcss --D
```

---

`.prettierrc.js`

```js
export default {
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 行尾需要有分号
  semi: true,
  // 一行最多几个字符
  printWidth: 120,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 是否有引号格式保持一致
  quoteProps: 'consistent',
  // html 空格敏感规则
  htmlWhitespaceSensitivity: 'ignore',
  // 多行时不强制尾随逗号
  trailingComma: 'none',
  // 箭头函数参数括号
  arrowParens: 'avoid',
  // jsx 中使用单引号
  jsxSingleQuote: true,
  // 对象括号内是否添加空格
  bracketSpacing: true,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss']
};
```

`.prettierignore`

```bash
/dist/*
/node_modules/**
/src/assets/*
src/**/*.d.ts

**/*.svg
**/*.sh
*.log
*.md
*.svg
*.png
*.ico
*ignore

.husky
.local
.output.js
.DS_Store
.idea
.editorconfig
pnpm-lock.yaml
.npmrc
```

`eslint.config.js`

```js
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginImport from 'eslint-plugin-import';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.vscode/**', 'build/**', 'eslint.config.js'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2020
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'import': pluginImport,
      'prettier': pluginPrettier
    },
    settings: {
      'react': {
        version: 'detect'
      },
      'import/resolver': {
        typescript: true,
        node: true
      }
    },

    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginReactHooks.configs.recommended,
      {
        files: ['**/*.{jsx,tsx}'],
        ...pluginReact.configs.flat.jsxRuntime
      }
    ]
  },
  {
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'internal',
            'object',
            'type'
          ],
          'pathGroups': [
            { pattern: 'react*', group: 'builtin', position: 'before' },
            { pattern: '@/components/**', group: 'parent', position: 'before' },
            { pattern: '@/utils/**', group: 'parent', position: 'after' }
          ],
          'pathGroupsExcludedImportTypes': ['react'],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-this-alias': ['error', { allowedNames: ['that'] }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn'
    }
  },
  configPrettier,
  {
    plugins: { prettier: pluginPrettier },
    rules: {
      ...pluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'warn'
    }
  }
);
```

`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,

    "baseUrl": ".", //基础路径
    "paths": { "@/*": ["src/*"] } //路径映射
  },
  "include": ["src"]
}
```

`vite.config.ts`

```ts
import { defineConfig } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve('./src') // 用@代替src
    }
  }
});
```

