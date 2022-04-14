import type { FileScope } from './types';
export declare function setFileScope(filePath: string, packageName?: string): void;
export declare function endFileScope(): void;
export declare function hasFileScope(): boolean;
export declare function getFileScope(): FileScope;
export declare function getAndIncrementRefCounter(): number;
