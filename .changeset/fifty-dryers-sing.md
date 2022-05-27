---
'rainbow-sprinkles': minor
---

This is a big refactor to support composing multiple instances of properties. AKA, this makes the API match closer to `@vanilla-extract/sprinkles`, where you use `defineProperties` to create one or more sets of properties, then compose them with `createRainbowSprinkles`.

Before:

```tsx
// rainbow-sprinkles.css.ts
import {createRainbowSprinkles} from 'rainbow-sprinkles';

export const rainbowSprinkles = createRainbowSprinkles({ ... })
```

After:

````tsx
// rainbow-sprinkles.css.ts
import {defineProperties, createRainbowSprinkles} from 'rainbow-sprinkles';

const properties = defineProperties({ ... })

export const rainbowSprinkles = createRainbowSprinkles(properties)
```tx

````
