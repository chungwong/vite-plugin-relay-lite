import { type ASTNode } from 'graphql';
/**
 * Vendored GraphQL printer
 * Fork from https://github.com/graphql/graphql-js/blob/v15.3.0/src/language/printer.js
 *
 * This ensure compatibility with generated document hash by the Relay compiler.
 * graphql-js' printer is incompatible with Relay's one since v15.4
 *
 * Later Relay team should provide a policy to deal with it.
 *
 * @see https://github.com/cometkim/vite-plugin-relay-lite/issues/53
 * @see https://github.com/facebook/relay/issues/4226
 */
export declare function print(ast: ASTNode): string;
