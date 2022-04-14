export interface PackageInfo {
    name: string;
    path: string;
    dirname: string;
}
export declare function getPackageInfo(cwd?: string | null): PackageInfo;
