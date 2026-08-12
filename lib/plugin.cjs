"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/plugin.ts
var plugin_exports = {};
__export(plugin_exports, {
  default: () => makePlugin
});
module.exports = __toCommonJS(plugin_exports);
var path2 = __toESM(require("node:path"), 1);
var import_kleur2 = __toESM(require("kleur"), 1);
var import_cosmiconfig = require("cosmiconfig");

// src/compile.ts
var crypto = __toESM(require("node:crypto"), 1);
var path = __toESM(require("node:path"), 1);
var import_magic_string = __toESM(require("magic-string"), 1);
var import_graphql2 = require("graphql");

// src/graphql-printer.ts
var import_graphql = require("graphql");
function print(ast) {
  return (0, import_graphql.visit)(ast, {
    Name: { leave: /* @__PURE__ */ __name((node) => node.value, "leave") },
    Variable: { leave: /* @__PURE__ */ __name((node) => "$" + node.name, "leave") },
    Document: { leave: /* @__PURE__ */ __name((node) => join(node.definitions, "\n") + "\n", "leave") },
    OperationDefinition: {
      leave(node) {
        const varDefs = wrap("(", join(node.variableDefinitions, ", "), ")");
        const prefix = join(
          [
            node.operation,
            join([node.name, varDefs]),
            join(node.directives, " ")
          ],
          " "
        );
        return (prefix === "query" ? "" : prefix + " ") + node.selectionSet;
      }
    },
    VariableDefinition: {
      leave: /* @__PURE__ */ __name(({ variable, type, defaultValue, directives }) => variable + ": " + type + wrap(" = ", defaultValue) + wrap(" ", join(directives, " ")), "leave")
    },
    SelectionSet: {
      leave: /* @__PURE__ */ __name(({ selections }) => block(selections), "leave")
    },
    Field: {
      leave: /* @__PURE__ */ __name(({ alias, name, arguments: args, directives, selectionSet }) => join([
        wrap("", alias, ": ") + name + wrap("(", join(args, ", "), ")"),
        wrap(" ", join(directives, " ")),
        wrap(" ", selectionSet)
      ]), "leave")
    },
    Argument: {
      leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave")
    },
    FragmentSpread: {
      leave: /* @__PURE__ */ __name(({ name, directives }) => "..." + name + wrap(" ", join(directives, " ")), "leave")
    },
    InlineFragment: {
      leave: /* @__PURE__ */ __name(({ typeCondition, directives, selectionSet }) => join(
        [
          "...",
          wrap("on ", typeCondition),
          join(directives, " "),
          selectionSet
        ],
        " "
      ), "leave")
    },
    FragmentDefinition: {
      leave: /* @__PURE__ */ __name(({
        name,
        typeCondition,
        variableDefinitions,
        directives,
        selectionSet
      }) => (
        // Note: fragment variable definitions are experimental and may be changed
        // or removed in the future.
        `fragment ${name}${wrap("(", join(variableDefinitions, ", "), ")")} on ${typeCondition} ${wrap("", join(directives, " "), " ")}` + selectionSet
      ), "leave")
    },
    IntValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
    FloatValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
    StringValue: {
      leave: /* @__PURE__ */ __name(({ value, block: isBlockString }) => isBlockString ? printBlockString(value) : printString(value), "leave")
    },
    BooleanValue: { leave: /* @__PURE__ */ __name(({ value }) => value ? "true" : "false", "leave") },
    NullValue: { leave: /* @__PURE__ */ __name(() => "null", "leave") },
    EnumValue: { leave: /* @__PURE__ */ __name(({ value }) => value, "leave") },
    ListValue: { leave: /* @__PURE__ */ __name(({ values }) => "[" + join(values, ", ") + "]", "leave") },
    ObjectValue: { leave: /* @__PURE__ */ __name(({ fields }) => "{" + join(fields, ", ") + "}", "leave") },
    ObjectField: { leave: /* @__PURE__ */ __name(({ name, value }) => name + ": " + value, "leave") },
    Directive: {
      leave: /* @__PURE__ */ __name(({ name, arguments: args }) => "@" + name + wrap("(", join(args, ", "), ")"), "leave")
    },
    NamedType: { leave: /* @__PURE__ */ __name(({ name }) => name, "leave") },
    ListType: { leave: /* @__PURE__ */ __name(({ type }) => "[" + type + "]", "leave") },
    NonNullType: { leave: /* @__PURE__ */ __name(({ type }) => type + "!", "leave") }
  });
}
__name(print, "print");
function join(maybeArray, separator = "") {
  return maybeArray?.filter((x) => x).join(separator) ?? "";
}
__name(join, "join");
function block(array) {
  return wrap("{\n", indent(join(array, "\n")), "\n}");
}
__name(block, "block");
function wrap(start, maybeString, end = "") {
  return maybeString != null && maybeString !== "" ? start + maybeString + end : "";
}
__name(wrap, "wrap");
function indent(str) {
  return wrap("  ", str.replaceAll("\n", "\n  "));
}
__name(indent, "indent");
function printBlockString(value, options) {
  const escapedValue = value.replaceAll('"""', '\\"""');
  const lines = escapedValue.split(/\r\n|[\n\r]/g);
  const isSingleLine = lines.length === 1;
  const forceLeadingNewLine = lines.length > 1 && lines.slice(1).every((line) => line.length === 0 || isWhiteSpace(line.charCodeAt(0)));
  const hasTrailingTripleQuotes = escapedValue.endsWith('\\"""');
  const hasTrailingQuote = value.endsWith('"') && !hasTrailingTripleQuotes;
  const hasTrailingSlash = value.endsWith("\\");
  const forceTrailingNewline = hasTrailingQuote || hasTrailingSlash;
  const printAsMultipleLines = !options?.minimize && // add leading and trailing new lines only if it improves readability
  (!isSingleLine || value.length > 70 || forceTrailingNewline || forceLeadingNewLine || hasTrailingTripleQuotes);
  let result = "";
  const skipLeadingNewLine = isSingleLine && isWhiteSpace(value.charCodeAt(0));
  if (printAsMultipleLines && !skipLeadingNewLine || forceLeadingNewLine) {
    result += "\n";
  }
  result += escapedValue;
  if (printAsMultipleLines || forceTrailingNewline) {
    result += "\n";
  }
  return '"""' + result + '"""';
}
__name(printBlockString, "printBlockString");
function isWhiteSpace(code) {
  return code === 9 || code === 32;
}
__name(isWhiteSpace, "isWhiteSpace");
function printString(str) {
  return `"${str.replace(escapedRegExp, escapedReplacer)}"`;
}
__name(printString, "printString");
var escapedRegExp = /[\x00-\x1f\x22\x5c\x7f-\x9f]/g;
function escapedReplacer(str) {
  return escapeSequences[str.charCodeAt(0)];
}
__name(escapedReplacer, "escapedReplacer");
var escapeSequences = [
  "\\u0000",
  "\\u0001",
  "\\u0002",
  "\\u0003",
  "\\u0004",
  "\\u0005",
  "\\u0006",
  "\\u0007",
  "\\b",
  "\\t",
  "\\n",
  "\\u000B",
  "\\f",
  "\\r",
  "\\u000E",
  "\\u000F",
  "\\u0010",
  "\\u0011",
  "\\u0012",
  "\\u0013",
  "\\u0014",
  "\\u0015",
  "\\u0016",
  "\\u0017",
  "\\u0018",
  "\\u0019",
  "\\u001A",
  "\\u001B",
  "\\u001C",
  "\\u001D",
  "\\u001E",
  "\\u001F",
  "",
  "",
  '\\"',
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 2F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 3F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 4F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\\\",
  "",
  "",
  "",
  // 5F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  // 6F
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "\\u007F",
  "\\u0080",
  "\\u0081",
  "\\u0082",
  "\\u0083",
  "\\u0084",
  "\\u0085",
  "\\u0086",
  "\\u0087",
  "\\u0088",
  "\\u0089",
  "\\u008A",
  "\\u008B",
  "\\u008C",
  "\\u008D",
  "\\u008E",
  "\\u008F",
  "\\u0090",
  "\\u0091",
  "\\u0092",
  "\\u0093",
  "\\u0094",
  "\\u0095",
  "\\u0096",
  "\\u0097",
  "\\u0098",
  "\\u0099",
  "\\u009A",
  "\\u009B",
  "\\u009C",
  "\\u009D",
  "\\u009E",
  "\\u009F"
];

// src/compile.ts
function compile(file, source, options) {
  const content = new import_magic_string.default(source);
  const imports = /* @__PURE__ */ new Set();
  const pattern = /(?<prefix>^|[\=\?\:\|\&\,\;\(\[\{\}\.\>]|\*\/)(?<blank>\s*)graphql`(?<query>[^`]*)`/gm;
  content.replace(pattern, (match, prefix, blank, query) => {
    if (/^\s*(?!#)\/\//gm.test(query)) {
      return match;
    }
    const ast = (0, import_graphql2.parse)(query);
    if (ast.definitions.length === 0) {
      throw new Error("Unexpected empty graphql tag.");
    }
    if (ast.definitions.length > 1) {
      throw new Error("Expected exactly one definition per graphql tag");
    }
    const definition = ast.definitions[0];
    if (definition.kind !== import_graphql2.Kind.FRAGMENT_DEFINITION && definition.kind !== import_graphql2.Kind.OPERATION_DEFINITION) {
      throw new Error(
        "Expected a fragment, mutation, query, or subscription, got `" + definition.kind + "`."
      );
    }
    const name = definition.name?.value;
    if (!name) {
      throw new Error("GraphQL operations and fragments must contain names");
    }
    const hash = crypto.createHash("md5").update(print(definition), "utf8").digest("hex");
    const id = `graphql__${hash}`;
    const importFile = `${name}.graphql`;
    const importPath = options.artifactDirectory ? getRelativeImportPath(file, importFile, options.artifactDirectory) : `./__generated__/${importFile}`;
    let result = id;
    switch (options.module) {
      case "esmodule": {
        imports.add(`import ${id} from "${importPath}";`);
        break;
      }
      case "commonjs": {
        result = `require("${importPath}")`;
        break;
      }
    }
    if (options.isDevelopment) {
      const error = getErrorMessage(name, options.codegenCommand);
      switch (options.module) {
        case "esmodule": {
          result = `(${id}.hash && ${id}.hash !== "${hash}" && console.error("${error}"), ${id})`;
          break;
        }
        case "commonjs": {
          result = `typeof ${id} === "object" ? ${id} : (${id} = ${result}, ${id}.hash && ${id}.hash !== "${hash}" && console.error("${error}"), ${id})`;
          break;
        }
      }
    }
    return prefix + blank + result;
  });
  content.prepend(
    [...imports, ""].join("\n")
  );
  if (options.omitTagImport) {
    omitImports(content);
  }
  return {
    code: content.toString(),
    map: content.generateMap({ hires: true })
  };
}
__name(compile, "compile");
function omitImports(content) {
  const pattern = /(^[ \t]*(import|const|let|var)\s*{([^}]*?\s*)??)(\s*graphql,\s*|\s*,?\s*graphql\s*)([^}]*\s*?})/gm;
  content.replace(pattern, (_match, $1, _$2, _$3, _omit, $5) => {
    return $1 + $5;
  });
}
__name(omitImports, "omitImports");
function getErrorMessage(name, codegenCommand) {
  return `The definition of '${name}' appears to have changed. Run \`${codegenCommand}\` to update the generated files to receive the expected data.`;
}
__name(getErrorMessage, "getErrorMessage");
function getRelativeImportPath(file, fileToRequire, artifactDirectory) {
  const relativePath = path.relative(
    path.dirname(file),
    path.resolve(artifactDirectory)
  );
  const relativeReference = relativePath.length === 0 || !relativePath.startsWith(".") ? "./" : "";
  const joinedPath = relativeReference + path.join(relativePath, fileToRequire);
  return joinedPath.replaceAll("\\", "/");
}
__name(getRelativeImportPath, "getRelativeImportPath");

// src/codegen.ts
var import_node_child_process = require("node:child_process");
var import_kleur = __toESM(require("kleur"), 1);
async function launchProcess(options) {
  const cwd = options.cwd;
  const cmd = options.codegenCommand;
  const args = [];
  if (options.watch) {
    args.push("--watch");
  }
  if (options.relayConfigPath) {
    args.push(options.relayConfigPath);
  }
  const child = (0, import_node_child_process.spawn)(cmd, args, {
    cwd,
    shell: true,
    windowsHide: false
  });
  let compileOnce = /* @__PURE__ */ __name((_value) => {
  }, "compileOnce");
  child.stdout.on("data", (chunk) => {
    const prefix = import_kleur.default.green(`[${cmd}]`);
    const output = chunk.toString().trimEnd();
    console.log(prefix, output);
    const watchingMessages = [
      "Compilation completed",
      "Watching for changes to graphql"
    ];
    if (options.watch && watchingMessages.some((message) => output.includes(message))) {
      compileOnce(true);
    }
  });
  child.stderr.on("data", (chunk) => {
    const prefix = import_kleur.default.red(`[${cmd}]`);
    const output = chunk.toString().trimEnd();
    console.error(prefix, output);
  });
  if (options.watch) {
    await new Promise((resolve3) => {
      compileOnce = resolve3;
    });
  } else {
    await new Promise((resolve3, reject) => {
      child.on("close", (code) => {
        if (code === 0) {
          resolve3(code);
        } else {
          reject(code);
        }
      });
    });
  }
}
__name(launchProcess, "launchProcess");

// src/plugin.ts
var configExplorer = (0, import_cosmiconfig.cosmiconfigSync)("relay", {
  searchStrategy: "none",
  searchPlaces: [
    "relay.config.js",
    "relay.config.json",
    ".config/relay.config.js",
    ".config/relay.config.json",
    ".config/relay.js",
    ".config/relay.json",
    "package.json"
  ],
  loaders: {
    ".json": import_cosmiconfig.defaultLoadersSync[".json"],
    ".js": import_cosmiconfig.defaultLoadersSync[".js"]
  }
});
function makePlugin(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  let relayConfig = {};
  let relayConfigPath = null;
  if (options.relayConfig && typeof options.relayConfig === "object") {
    relayConfig = options.relayConfig;
  } else {
    try {
      const result = typeof options.relayConfig === "string" ? configExplorer.load(options.relayConfig) : configExplorer.search(cwd);
      if (result) {
        relayConfig = result.config;
        relayConfigPath = result.filepath;
      }
    } catch (_err) {
    }
  }
  const defaultSourcePredicate = /* @__PURE__ */ __name((modulePath) => {
    const sourceDirectory = path2.resolve(cwd, relayConfig["src"] || "./src").split(path2.sep).join(path2.posix.sep);
    return !/node_modules|\.yarn/.test(modulePath) && modulePath.startsWith(sourceDirectory);
  }, "defaultSourcePredicate");
  const artifactDirectory = relayConfig["artifactDirectory"];
  const codegenCommand = relayConfig["codegenCommand"] || "relay-compiler";
  const module2 = options.module || ((relayConfig["eagerESModules"] || relayConfig["eagerEsModules"]) ?? true ? "esmodule" : "commonjs");
  const omitTagImport = options.omitTagImport ?? false;
  const shouldTransform = options.shouldTransform ?? defaultSourcePredicate;
  if (module2 !== "esmodule") {
    console.warn(
      import_kleur2.default.yellow(
        "Using CommonJS may not work.\nConsider to set `eagerEsModules` to `true` in your Relay config"
      )
    );
  }
  return {
    name: "vite-plugin-relay-lite",
    enforce: "pre",
    async configResolved({ build, command, mode }) {
      if (options.codegen === false) {
        return;
      }
      const willGenerate = command === "serve" && mode === "development" || command === "build";
      const watch = command === "serve" || Boolean(build.watch);
      if (willGenerate) {
        await launchProcess({
          cwd,
          codegenCommand,
          relayConfigPath,
          watch
        });
      }
    },
    transform(src, id) {
      if (!shouldTransform(id)) {
        return;
      }
      const url = new URL(id, "file:");
      if (!/\.(c|m)?(j|t)sx?$/.test(url.pathname)) {
        return;
      }
      if (!src.includes("graphql`")) {
        return;
      }
      const env = process.env;
      const result = compile(id, src, {
        module: module2,
        codegenCommand,
        omitTagImport,
        isDevelopment: env.NODE_ENV !== "production",
        ...typeof artifactDirectory === "string" && { artifactDirectory }
      });
      return result;
    }
  };
}
__name(makePlugin, "makePlugin");
/*! For license information please see plugin.cjs.LEGAL.txt */
//# sourceMappingURL=plugin.cjs.map
