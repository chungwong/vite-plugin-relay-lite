import type { Plugin } from 'vite';
type AnyObject = Record<string, unknown>;
export type PluginOptions = {
    /**
     * Automatically execute `relay-compiler` command as necessary.
     *
     * @default true
     */
    codegen?: boolean;
    /**
     * Path to the Relay config file.
     * Or pass config object directly to customize behavior.
     *
     * @default Will be searched in the project automatically.
     */
    relayConfig?: string | AnyObject;
    /**
     * Module format on outputs
     *
     * @default follows the `eagerESModules` in the Relay config.
     */
    module?: 'esmodule' | 'commonjs';
    /**
     * (Experimental) omit import statement of the `graphql` tag.
     */
    omitTagImport?: boolean;
    /**
     * (Experimental) Custom predicate function to determine that the given module path will be transformed.
     *
     * Default, it checks if the path isn't within the `node_modules` and `.yarn`
     * and check if the path is within the `src` path in your Relay config.
     */
    shouldTransform?: SourcePredicate;
    /**
     * (Experimental) Customize process cwd
     *
     * The plugin will search config, spawn codegen from the given path.
     *
     * Forcing it to `__dirname` or `import.meta.dirname` might help when you're working on monorepo.
     */
    cwd?: string;
};
type SourcePredicate = (modulePath: string) => boolean;
export default function makePlugin(options?: PluginOptions): Plugin;
export {};
