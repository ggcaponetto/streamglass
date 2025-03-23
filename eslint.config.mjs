// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

const eslintConfig = tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
);

// prepend a global file ignore
eslintConfig.unshift(
    {
        // acts as global ignores, due to the absence of other properties
        ignores: ["**/node_modules/", ".git/", "**/dist/", "**/packages/frontend/"] 
    },
)

export default eslintConfig;