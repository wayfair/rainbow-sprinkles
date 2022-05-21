import { ElementType, ComponentPropsWithoutRef } from 'react';
import { rainbowSprinkles, Sprinkles } from './rainbow-sprinkles.css';

export type BoxProps<C extends ElementType> = Sprinkles &
  ComponentPropsWithoutRef<C> & {
    as?: C;
  };

export const Box = <C extends ElementType = 'div'>({
  as,
  children,
  ...props
}: BoxProps<C>) => {
  const Component = as || 'div';
  const { className, style, otherProps } = rainbowSprinkles(props);

  return (
    <Component className={className} style={style} {...otherProps}>
      {children}
    </Component>
  );
};
