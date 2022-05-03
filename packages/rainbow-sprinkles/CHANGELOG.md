# rainbow-sprinkles

## 0.9.3

### Patch Changes

- e97903d: Add CSSVarFunction as a value type for dynamicProperties

## 0.9.2

### Patch Changes

- 643499a: Add CSSVarFunction as value to dynamicProperties and staticProperties

## 0.9.1

### Patch Changes

- b1a10d9: Move vanilla-extract dependencies to peer dependencies

## 0.9.0

### Minor Changes

- 4440ab3: Replaced csstype with internal fork

## 0.8.1

### Patch Changes

- ce2f0ce: Update readme

## 0.8.0

### Minor Changes

- abbd196: Refactor of the CSS creation logic to improve readability and types
- f327cba: Refactored and improved types, so sprinkles props are now fully accurate. Additionally, all values that are provided with an alias (e.g., when using `vars`) will require a '\$' prefix

## 0.7.0

### Minor Changes

- 271d262: Introduced staticProperties, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size

  - `properties` renamed to `dynamicProperties`

- 80821d8: - Introduced `staticProperties`, which allows configuration of fixed utility classes (not dynamic). Can be useful for frequently used CSS property/value pairs to reduce overall bundle size
  - `properties` renamed to `dynamicProperties`
    prefix. This helps to clarify which values are theme values when other values are acceptable.
