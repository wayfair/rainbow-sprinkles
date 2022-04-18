import type { PropertiesFallback } from 'csstype';

export type CSSProperties = PropertiesFallback<number | (string & {})>;

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
  [k in keyof CSSProperties]?:
    | ReadonlyArray<CSSProperties[k]>
    | Record<string, CSSProperties[k]>
    | true;
};


export type BaseConditions = { [conditionName: string]: Condition };
