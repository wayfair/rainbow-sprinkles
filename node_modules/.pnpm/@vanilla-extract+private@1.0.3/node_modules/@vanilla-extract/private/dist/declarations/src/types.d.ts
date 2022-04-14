export declare type CSSVarFunction = `var(--${string})` | `var(--${string}, ${string | number})`;
export declare type Contract = {
    [key: string]: CSSVarFunction | null | Contract;
};
declare type Primitive = string | boolean | number | null | undefined;
export declare type MapLeafNodes<Obj, LeafType> = {
    [Prop in keyof Obj]: Obj[Prop] extends Primitive ? LeafType : Obj[Prop] extends Record<string | number, any> ? MapLeafNodes<Obj[Prop], LeafType> : never;
};
export {};
