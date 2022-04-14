import type { PackageInfo } from './packageInfo';
interface AddFileScopeParams {
    source: string;
    filePath: string;
    packageInfo: PackageInfo;
}
export declare function addFileScope({ source, filePath, packageInfo, }: AddFileScopeParams): {
    source: string;
    updated: boolean;
};
export {};
