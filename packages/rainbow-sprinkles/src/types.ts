import type { Properties } from './css';

export interface CSSProperties extends Properties {}

// Configuration

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type BaseConditions = { [conditionName: string]: Condition };

export type PrefixValue<T> = `$${(string | number) & T}`;

export type BaseShorthand<DynamicProperties, StaticProperties> = {
  [shorthandName: string]: Array<
    keyof DynamicProperties | keyof StaticProperties
  >;
};

export type ConditionalMap = {
  default: string;
  conditions: { [condition: string]: string };
};

export type CreateStylesOutput = {
  dynamic?: {
    default: string;
    conditions: { [condition: string]: string };
  };
  values?: {
    [value: string]: {
      default: string;
      conditions: { [condition: string]: string };
    };
  };
  name: string;
  vars?: {
    default: string;
    conditions: { [condition: string]: string };
  };
  staticScale?: string[] | Record<string, string>;
  dynamicScale?: true | Record<string, string>;
};

// Props

// Runtime Function
