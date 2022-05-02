import type { Properties } from './css';

export interface CSSProperties extends Properties {}

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
