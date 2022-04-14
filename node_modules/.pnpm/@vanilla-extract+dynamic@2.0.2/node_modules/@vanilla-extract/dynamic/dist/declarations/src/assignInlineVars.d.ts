import { Contract, MapLeafNodes } from '@vanilla-extract/private';
declare type Styles = {
    [cssVarName: string]: string;
};
export declare function assignInlineVars(vars: Record<string, string>): Styles;
export declare function assignInlineVars<ThemeContract extends Contract>(contract: ThemeContract, tokens: MapLeafNodes<ThemeContract, string>): Styles;
export {};
