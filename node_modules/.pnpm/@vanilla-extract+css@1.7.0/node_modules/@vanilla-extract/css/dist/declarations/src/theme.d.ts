import type { Contract, MapLeafNodes } from '@vanilla-extract/private';
import type { ThemeVars, Tokens } from './types';
export declare function createGlobalTheme<ThemeTokens extends Tokens>(selector: string, tokens: ThemeTokens): ThemeVars<ThemeTokens>;
export declare function createGlobalTheme<ThemeContract extends Contract>(selector: string, themeContract: ThemeContract, tokens: MapLeafNodes<ThemeContract, string>): void;
export declare function createTheme<ThemeTokens extends Tokens>(tokens: ThemeTokens, debugId?: string): [className: string, vars: ThemeVars<ThemeTokens>];
export declare function createTheme<ThemeContract extends Contract>(themeContract: ThemeContract, tokens: MapLeafNodes<ThemeContract, string>, debugId?: string): string;
