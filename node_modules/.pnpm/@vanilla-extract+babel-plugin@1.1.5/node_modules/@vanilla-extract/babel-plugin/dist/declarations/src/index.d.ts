import { PluginObj, PluginPass } from '@babel/core';
declare const styleFunctions: string[];
declare type StyleFunction = typeof styleFunctions[number];
declare type Context = PluginPass & {
    namespaceImport: string;
    importIdentifiers: Map<string, StyleFunction>;
    packageIdentifiers: Set<string>;
    filePath: string;
    packageName: string;
    isCssFile: boolean;
    alreadyCompiled: boolean;
    isESM: boolean;
};
export default function (): PluginObj<Context>;
export {};
