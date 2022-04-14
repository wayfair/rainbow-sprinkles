# Rainbow Sprinkles 🧁

Dynamic, theme-driven, style props for [vanilla-extract](https://vanilla-extract.style).

Rainbow sprinkles works similarly to `@vanilla-extract/sprinkles`. Like sprinkles, it generates custom CSS utility classes at build time. While sprinkles requires a pre-defined list of available values, Rainbow Sprinkles uses CSS custom properties to allow dynamic values using inline style variable assignments.

Compared to sprinkles:

- **Rainbow sprinkles ships 85% less CSS.** For each property, Sprinkles produces CSS that's a factor of `pre-defined values * possible conditions`. Rainbow sprinkles produces CSS that only scales with the number of conditions.
- **Supports dynamic values.** Rainbow Sprinkles uses dynamic inline style assignments to set the value of each property. You still get the TypeScript editor suggestions, but the ability to use any valid CSS value for that property.
- **Cannot be used in `.css.ts` files.** Rainbow Sprinkles derives its values from inline style property assignments, which means it needs to be configured with a "host" element (see setup for details).

## Setup

Install Rainbow Sprinkles.

```bash
npm install @homebase/rainbow-sprinkles
```

Create a `rainbow-sprinkles.css.ts` file, then export your configuration methods:

```typescript
import { rainbowSprinkles } from '@homebase/rainbow-sprinkles';

const vars = {
  space: {
    none: 0,
    small: '4px',
    medium: '8px',
    large: '16px',
    // etc.
  },
  colors: {
    'blue-50': '#eff6ff',
    'blue-100': '#dbeafe',
    'blue-200': '#bfdbfe',
    'gray-700': '#374151',
    'gray-800': '#1f2937',
    'gray-900': '#111827',
    // etc.
  },
};

export const {
  createSystemPropCss,
  getBoxProps,
  createSystemPropType,
  properties,
  config,
} = rainbowSprinkles({
  conditions: {
    mobile: {},
    tablet: { '@media': 'screen and (min-width: 768px)' },
    desktop: { '@media': 'screen and (min-width: 1024px)' },
  },
  defaultCondition: 'mobile',
  properties: {
    // Define pre-determined values, which will be autosuggested
    color: vars.colors,
    backgroundColor: vars.colors,
    margin: vars.space,
    marginTop: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    marginBottom: vars.space,
    // Will work with any CSS value
    display: true,
    textAlign: true,
    flexDirection: true,
    justifyContent: true,
    alignItems: true,
  },
  shorthands: {
    bg: ['backgroundColor'],
    m: ['margin'],
    mr: ['marginRight'],
    ml: ['marginLeft'],
    mt: ['marginTop'],
    mb: ['marginBottom'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

export type SystemProps = Parameters<typeof createSystemPropType>[0];
```

Then set-up in your "host" component (in this case, a Box component):

```typescript
// Box.css.ts
import { createSystemPropCss } from './rainbow-sprinkles';

export const systemPropStyles = createSystemPropCss();
```

```tsx
// Box.tsx
import { systemPropStyles } from './Box.css';
import { getBoxProps, properties, SystemProps } from './rainbow-sprinkles';
import { extractAtomsFromProps } from 'rainbow-sprinkles';

interface BoxProps extends SystemProps {
  children?: React.ReactNode;
}

export const Box = ({ children, ...props }: BoxProps) => {
  const { systemProps, otherProps } = extractAtomsFromProps(props, properties);

  return (
    <div {...getBoxProps(systemPropStyles, systemProps)} {...otherProps}>
      {children}
    </div>
  );
};
```

Good to go!

```tsx
import { Box } from './Box';

function App() {
  return (
    // Use pre-defined values
    <Box backgroundColor="blue-50" m="large">
      {/* Or any valid CSS value */}
      <Box textAlign="center">Hello world!</Box>
    </Box>
  );
}
```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. For detailed contributing guidelines, please see [CONTRIBUTING.md](CONTRIBUTING.md)

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Rogin Farrer - [@roginfarrer](https://twitter.com/roginfarrer)
