import { MapLeafNodes } from './types';
declare type Primitive = string | number | null | undefined;
declare type Walkable = {
    [Key in string | number]: Primitive | Walkable;
};
export declare function walkObject<T extends Walkable, MapTo>(obj: T, fn: (value: Primitive, path: Array<string>) => MapTo, path?: Array<string>): MapLeafNodes<T, MapTo>;
export {};
