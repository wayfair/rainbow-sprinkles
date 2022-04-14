import { FileScope, Adapter } from '@vanilla-extract/css';
export declare function stringifyFileScope({ packageName, filePath, }: FileScope): string;
export declare function parseFileScope(serialisedFileScope: string): FileScope;
export declare type IdentifierOption = ReturnType<Adapter['getIdentOption']>;
interface ProcessVanillaFileOptions {
    source: string;
    filePath: string;
    outputCss?: boolean;
    identOption?: IdentifierOption;
    serializeVirtualCssPath?: (file: {
        fileName: string;
        fileScope: FileScope;
        source: string;
    }) => string | Promise<string>;
}
export declare function processVanillaFile({ source, filePath, outputCss, identOption, serializeVirtualCssPath, }: ProcessVanillaFileOptions): Promise<string>;
export {};
