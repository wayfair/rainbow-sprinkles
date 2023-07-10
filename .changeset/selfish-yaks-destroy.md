---
'rainbow-sprinkles': minor
---

Support assigning properties to layers via `@layer` option on `defineProperties`

**Example usage:**

```ts
// sprinkles.css.ts
import { defineProperties } from 'rainbow-sprinkles';
import { layer } from '@vanilla-extract/css';

export const sprinklesLayer = layer();

const properties = defineProperties({
  '@layer': sprinklesLayer,
  // etc.
});
