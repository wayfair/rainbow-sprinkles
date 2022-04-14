import { Plugin } from 'esbuild';
export declare const vanillaExtractFilescopePlugin: () => Plugin;
interface CompileOptions {
    filePath: string;
    cwd?: string;
    externals?: Array<string>;
}
export declare function compile({ filePath, cwd, externals, }: CompileOptions): Promise<{
    source: string;
    watchFiles: string[];
}>;
export {};
