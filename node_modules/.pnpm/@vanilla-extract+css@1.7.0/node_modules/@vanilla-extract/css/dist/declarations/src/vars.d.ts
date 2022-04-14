import { Contract, MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';
import { Tokens, NullableTokens, ThemeVars } from './types';
export declare function createVar(debugId?: string): CSSVarFunction;
export declare function fallbackVar(...values: [string, ...Array<string>]): CSSVarFunction;
export declare function assignVars<VarContract extends Contract>(varContract: VarContract, tokens: MapLeafNodes<VarContract, string>): Record<CSSVarFunction, string>;
export declare function createThemeContract<ThemeTokens extends NullableTokens>(tokens: ThemeTokens): ThemeVars<ThemeTokens>;
export declare function createGlobalThemeContract<ThemeTokens extends Tokens>(tokens: ThemeTokens): ThemeVars<ThemeTokens>;
export declare function createGlobalThemeContract<ThemeTokens extends NullableTokens>(tokens: ThemeTokens, mapFn: (value: string | null, path: Array<string>) => string): ThemeVars<ThemeTokens>;
