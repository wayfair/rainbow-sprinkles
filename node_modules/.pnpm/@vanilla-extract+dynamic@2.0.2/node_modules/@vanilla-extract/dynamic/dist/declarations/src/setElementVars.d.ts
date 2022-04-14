import { Contract, MapLeafNodes } from '@vanilla-extract/private';
export declare function setElementVars(element: HTMLElement, vars: Record<string, string>): void;
export declare function setElementVars<ThemeContract extends Contract>(element: HTMLElement, contract: ThemeContract, tokens: MapLeafNodes<ThemeContract, string>): void;
