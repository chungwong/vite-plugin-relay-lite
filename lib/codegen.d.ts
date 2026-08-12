type Options = {
    cwd: string;
    codegenCommand: string;
    relayConfigPath: string | null;
    watch: boolean;
};
export declare function launchProcess(options: Options): Promise<void>;
export {};
