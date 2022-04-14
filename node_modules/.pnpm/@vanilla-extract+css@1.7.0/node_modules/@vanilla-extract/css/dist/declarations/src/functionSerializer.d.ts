declare type Primitive = string | number | boolean | null | undefined;
declare type Serializable = {
    [Key in string | number]: Primitive | Serializable;
} | ReadonlyArray<Primitive | Serializable>;
interface SerializerConfig {
    importPath: string;
    importName: string;
    args: ReadonlyArray<Serializable>;
}
export declare function addFunctionSerializer<Target extends object>(target: Target, recipe: SerializerConfig): Target;
export {};
