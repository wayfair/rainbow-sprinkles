# rainbow-sprinkles

## 0.10.2

### Patch Changes

- 4d0158a: - Prevents scale values that do not have a `# rainbow-sprinkles prefix from evaluating to scale values.
  - Fixes the case where a configured CSS property had a defined scale for staticProperties, and allowed arbitrary values through dynamicProperties, and the incorrect classes were being generated

## 0.10.1

### Patch Changes

- 357ff4b: Fix latest tag

## 0.10.0

### Minor Changes

- de5a718: - `createRainbowSprinkles` can now (and should) be created in a `.css.js` file

  - `createRainbowSprinkles` now creates the CSS and returns _just_ the runtime function: `rainbowSprinkles`
  - `rainbowSprinkles` works similarly to `getBoxProps`, but now it returns a new property, `otherProps`, which are the props filtered through the function that are not rainbow sprinkles.

  The runtime function produced by `createRainbowSprinkles` is now serialized, meaning it can be exported from a `.css.js` file. (Attempting to do so previously would throw an error when being compiled by vanilla-extract.). Subsequently, this allowed a larger refactor to simplify the set-up API.

  Before:

  ```ts
  // rainbow-sprinkles.ts
  export const {
    getBoxProps,
    extractSprinklesFromProps,
    createRainbowSprinklesCss
  } = createRainbowSprinkles({ ... })
  ```

  After:

  ```ts
  // rainbow-sprinkles.css.ts
  export const rainbowSprinkles = createRainbowSprinkles({ ... })
  ```

  `rainbowSprinkles` functions similarly to `getBoxProps`, with the notable addition of `otherProps`:

  ```tsx
  // App.tsx
  import { rainbowSprinkles } from './rainbow-sprinkles.css';

  const Box = props => {
    const { className, style, otherProps } = rainbowSprinkles(props);

    return <div className={className} style={style} {...otherProps} />;
  };
  ```

### Patch Changes

- b6931a1: Fixed processing of null or undefined prop values

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
