/* eslint-disable import/no-default-export */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.{scss,css}',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
  ],
};
