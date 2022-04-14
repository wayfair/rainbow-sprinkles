import type { CSS, Composition } from './types';
interface TransformCSSParams {
    localClassNames: Array<string>;
    composedClassLists: Array<Composition>;
    cssObjs: Array<CSS>;
}
export declare function transformCss({ localClassNames, cssObjs, composedClassLists, }: TransformCSSParams): string[];
export {};
