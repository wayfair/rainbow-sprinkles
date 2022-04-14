import type { FileScope } from './types';
interface InjectStylesOptions {
    fileScope: FileScope;
    css: string;
}
export declare const injectStyles: ({ fileScope, css }: InjectStylesOptions) => void;
export {};
