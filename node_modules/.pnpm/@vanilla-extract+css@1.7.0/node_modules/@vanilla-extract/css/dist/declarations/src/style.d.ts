import type { FontFaceRule, CSSKeyframes, GlobalStyleRule, ClassNames, ComplexStyleRule } from './types';
export declare function style(rule: ComplexStyleRule, debugId?: string): string;
/**
 * @deprecated The same functionality is now provided by the 'style' function when you pass it an array
 */
export declare function composeStyles(...classNames: Array<ClassNames>): string;
export declare function globalStyle(selector: string, rule: GlobalStyleRule): void;
export declare function fontFace(rule: FontFaceRule, debugId?: string): string;
export declare function globalFontFace(fontFamily: string, rule: FontFaceRule): void;
export declare function keyframes(rule: CSSKeyframes, debugId?: string): string;
export declare function globalKeyframes(name: string, rule: CSSKeyframes): void;
export declare function styleVariants<StyleMap extends Record<string | number, ComplexStyleRule>>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;
export declare function styleVariants<Data extends Record<string | number, unknown>>(data: Data, mapData: <Key extends keyof Data>(value: Data[Key], key: Key) => ComplexStyleRule, debugId?: string): Record<keyof Data, string>;
