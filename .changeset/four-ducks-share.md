---
'rainbow-sprinkles': minor
---

- `createRainbowSprinkles` can now (and should) be created in a `.css.js` file
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
