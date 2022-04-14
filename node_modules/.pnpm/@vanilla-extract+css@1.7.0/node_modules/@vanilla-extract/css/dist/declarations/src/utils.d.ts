import type { ClassNames } from './types';
declare type BasicObj = {
    [key: string]: any;
};
export declare function forEach<Input extends BasicObj>(obj: Input | undefined, fn: <Key extends keyof Input>(value: Input[Key], key: string) => void): void;
export declare function omit<Input extends BasicObj, OmitKey extends string>(obj: Input | undefined, omitKeys: Array<OmitKey>): Omit<Input, OmitKey>;
export declare function mapKeys<Input extends BasicObj>(obj: Input | undefined, fn: <Key extends keyof Input>(value: Input[Key], key: string) => string): Record<string, Input[keyof Input]>;
export declare function isEqual(a: any, b: any): boolean;
export declare function dudupeAndJoinClassList(classNames: Array<ClassNames>): string;
export {};
