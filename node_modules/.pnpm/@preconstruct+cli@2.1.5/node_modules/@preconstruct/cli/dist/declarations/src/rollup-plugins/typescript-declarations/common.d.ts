export declare type DeclarationFile = {
    name: string;
    content: string;
};
export declare type EmittedDeclarationOutput = {
    /** The emitted d.ts types file. */
    types: DeclarationFile;
    /** The emitted d.ts.map declaration map file. */
    map?: DeclarationFile;
    /** The input TypeScript file */
    filename: string;
};
export declare type TS = typeof import("typescript");
export declare function getDiagnosticsHost(ts: TS, projectDir: string): import("typescript").FormatDiagnosticsHost;
export declare function loadTypeScript(packageDir: string, projectDir: string, pkgName: string): TS;
export declare function getProgram(dirname: string, pkgName: string, ts: TS): Promise<{
    options: import("typescript").CompilerOptions;
    program: import("typescript").Program;
}>;
export declare const getDeclarationsForFile: (filename: string, typescript: TS, program: import("typescript").Program, normalizedPkgDir: string, projectDir: string, diagnosticsHost: import("typescript").FormatDiagnosticsHost) => Promise<EmittedDeclarationOutput>;
export declare function overwriteDeclarationMapSourceRoot(content: string, actualSourceRoot: string): string;
