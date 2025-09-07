import type { Config } from 'prettier';

const config: Config = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'always',
  bracketSameLine: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['clsx', 'cva'],
};

export default config;