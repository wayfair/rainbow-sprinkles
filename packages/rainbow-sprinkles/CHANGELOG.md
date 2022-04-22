# rainbow-sprinkles

## 0.8.0

### Minor Changes

- abbd196: Refactor of the CSS creation logic to improve readability and types
- f327cba: Refactored and improved types, so sprinkles props are now fully accurate. Additionally, all values that are provided with an alias (e.g., when using `vars`) will require a '\

## 0.7.0

### Minor Changes

- 271d262: Introduced staticProperties, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size

  - `properties` renamed to `dynamicProperties`

- 80821d8: - Introduced `staticProperties`, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size
  - `properties` renamed to `dynamicProperties`
    prefix. This helps to clarify which values are theme values when other values are acceptable.

## 0.7.0

### Minor Changes

- 271d262: Introduced staticProperties, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size

  - `properties` renamed to `dynamicProperties`

- 80821d8: - Introduced `staticProperties`, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size
  - `properties` renamed to `dynamicProperties`
