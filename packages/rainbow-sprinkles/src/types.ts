import type { Properties } from './css';
import { createVar } from '@vanilla-extract/css';

export interface CSSProperties extends Properties {}

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

type CSSVarFunction = ReturnType<typeof createVar>;

export type ConfigStaticProperties = {
  [k in keyof CSSProperties]?:
    | Array<CSSProperties[k] | CSSVarFunction>
    | Record<string, CSSProperties[k] | CSSVarFunction>;
};

export type ConfigDynamicProperties = {
  [k in keyof CSSProperties]?: Record<string, CSSProperties[k]> | true;
};

export type BaseConditions = { [conditionName: string]: Condition };

export type PrefixValue<T> = `$${(string | number) & T}`;
