import { ElementType, ComponentPropsWithoutRef } from 'react';
import * as styles from './Box.css';
import {
  Sprinkles,
  getBoxProps,
  extractSprinklesFromProps,
} from '../rainbow-sprinkles';

const foo: Sprinkles = {
  color: '',
};

export type BoxProps<C extends ElementType> = Sprinkles &
  Omit<ComponentPropsWithoutRef<C>, keyof Sprinkles | 'is'> & {
    is?: C;
  };

export const Box = <C extends ElementType = 'div'>({
  is,
  children,
  ...props
}: BoxProps<C>) => {
  const { sprinkles, otherProps } = extractSprinklesFromProps(props);
  const Component = is || 'div';

  return (
    <Component
      {...getBoxProps(styles.sprinklesConfig, sprinkles)}
      {...otherProps}
    >
      {children}
    </Component>
  );
};
