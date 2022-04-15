import { ElementType, ComponentPropsWithoutRef } from 'react';
import * as styles from './Box.css';
import {
  SystemProps,
  getBoxProps,
  extractSprinklesFromProps,
} from '../rainbow-sprinkles';

export type BoxProps<C extends ElementType> = SystemProps &
  Omit<ComponentPropsWithoutRef<C>, keyof SystemProps | 'is'> & {
    is?: C;
  };

export const Box = <C extends ElementType = 'div'>({
  is,
  children,
  ...props
}: BoxProps<C>) => {
  const { systemProps, otherProps } = extractSprinklesFromProps(props);
  const Component = is || 'div';

  return (
    <Component
      {...getBoxProps(styles.systemPropClasses, systemProps)}
      {...otherProps}
    >
      {children}
    </Component>
  );
};
