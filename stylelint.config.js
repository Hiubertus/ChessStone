/* eslint-disable import/no-default-export */
export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  rules: {
    'selector-class-pattern': null, // Wyłącza regułę wymagającą konkretnego formatu nazw klas
    'keyframes-name-pattern': null, // Wyłącza regułę wymagającą kebab-case dla nazw keyframes
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwindcss',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          // Nowe dyrektywy z Tailwind CSS 3.4+
          'plugin',
          'custom-variant',
          'theme',
          'inline',
        ],
      },
    ],
    'no-descending-specificity': null, // Często konfliktuje z formatem CSS generowanym przez frameworki
    'at-rule-no-unknown': null, // Nadpisane przez scss/at-rule-no-unknown
    'block-no-empty': null, // Czasami puste bloki są przydatne jako placeholder
    'no-empty-source': null, // Pozwala na puste pliki SCSS
    'declaration-empty-line-before': null, // Pozwala na bardziej elastyczne formatowanie
    'value-keyword-case': null, // Pozwala na używanie camelCase w zmiennych CSS
    'function-name-case': null, // Pozwala na używanie camelCase w nazwach funkcji
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local', 'is'], // Dodano 'is' dla pseudo-klasy :is()
      },
    ],
    'color-function-notation': 'legacy', // Używanie starej notacji funkcji kolorów (rgb, hsl)
    'alpha-value-notation': 'number', // Preferuje wartości liczbowe zamiast procentów
    'selector-not-notation': 'simple', // Preferuje prostą notację dla selektora :not
  },
};
