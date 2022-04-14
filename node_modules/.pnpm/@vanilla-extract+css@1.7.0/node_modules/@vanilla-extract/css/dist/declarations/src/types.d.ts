import type { MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';
import type { PropertiesFallback, AtRule, Properties } from 'csstype';
import type { SimplePseudos } from './simplePseudos';
declare type CSSTypeProperties = PropertiesFallback<number | (string & {})>;
export declare type CSSProperties = {
    [Property in keyof CSSTypeProperties]: CSSTypeProperties[Property] | CSSVarFunction | Array<CSSVarFunction | Properties[Property]>;
};
export interface CSSKeyframes {
    [time: string]: CSSProperties;
}
export declare type CSSPropertiesWithVars = CSSProperties & {
    vars?: {
        [key: string]: string;
    };
};
declare type PseudoProperties = {
    [key in SimplePseudos]?: CSSPropertiesWithVars;
};
declare type CSSPropertiesAndPseudos = CSSPropertiesWithVars & PseudoProperties;
interface SelectorMap {
    [selector: string]: CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>> & FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;
}
export interface MediaQueries<StyleType> {
    '@media'?: {
        [query: string]: StyleType;
    };
}
export interface FeatureQueries<StyleType> {
    '@supports'?: {
        [query: string]: StyleType;
    };
}
export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
    selectors?: SelectorMap;
}
export declare type StyleRule = StyleWithSelectors & MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>> & FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>;
export declare type GlobalStyleRule = CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>> & FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;
export declare type GlobalFontFaceRule = Omit<AtRule.FontFaceFallback, 'src'> & Required<Pick<AtRule.FontFaceFallback, 'src'>>;
export declare type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;
export declare type CSSStyleBlock = {
    type: 'local';
    selector: string;
    rule: StyleRule;
};
export declare type CSSFontFaceBlock = {
    type: 'fontFace';
    rule: GlobalFontFaceRule;
};
export declare type CSSKeyframesBlock = {
    type: 'keyframes';
    name: string;
    rule: CSSKeyframes;
};
export declare type CSSSelectorBlock = {
    type: 'selector' | 'global';
    selector: string;
    rule: GlobalStyleRule;
};
export declare type CSS = CSSStyleBlock | CSSFontFaceBlock | CSSKeyframesBlock | CSSSelectorBlock;
export declare type FileScope = {
    packageName?: string;
    filePath: string;
};
export interface Composition {
    identifier: string;
    classList: string;
}
declare type IdentOption = 'short' | 'debug';
export interface Adapter {
    appendCss: (css: CSS, fileScope: FileScope) => void;
    registerClassName: (className: string) => void;
    registerComposition: (composition: Composition) => void;
    markCompositionUsed: (identifier: string) => void;
    onEndFileScope: (fileScope: FileScope) => void;
    getIdentOption: () => IdentOption;
}
export declare type NullableTokens = {
    [key: string]: string | NullableTokens | null;
};
export declare type Tokens = {
    [key: string]: string | Tokens;
};
export declare type ThemeVars<ThemeContract extends NullableTokens> = MapLeafNodes<ThemeContract, CSSVarFunction>;
export declare type ClassNames = string | Array<ClassNames>;
export declare type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;
export {};
