import { type SourceMap } from 'magic-string';
export type CompileOptions = {
    module: 'esmodule' | 'commonjs';
    codegenCommand: string;
    isDevelopment: boolean;
    omitTagImport?: boolean;
    artifactDirectory?: string;
};
export type CompileResult = {
    code: string;
    map: SourceMap;
};
export declare function compile(file: string, source: string, options: CompileOptions): CompileResult;
