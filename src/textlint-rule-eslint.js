// LICENSE : MIT
"use strict";
const CLIEngine = require("eslint").CLIEngine;
const path = require("path");
const defaultOptions = {
    // path to .eslintrc file
    "configFile": null,
    // recognize lang of CodeBlock
    "langs": ["js", "javascript", "node", "jsx"]
};
const getConfigBaseDir = (context) => {
    if (typeof context.getConfigBaseDir === "function") {
        return context.getConfigBaseDir();
    }
    // Fallback that use deprecated `config` value
    // https://github.com/textlint/textlint/issues/294
    const textlintRcFilePath = context.config ? context.config.configFile : null;
    // .textlinrc directory
    return textlintRcFilePath ? path.dirname(textlintRcFilePath) : process.cwd();
};

const reporter = (context, options) => {
    const { Syntax, RuleError, report, fixer, getSource } = context;
    if (!options.configFile) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    const availableLang = options.langs || defaultOptions.langs;
    const textlintRCDir = getConfigBaseDir(context);
    const ESLintOptions = {
        configFile: path.resolve(textlintRCDir, options.configFile)
    };
    const engine = new CLIEngine(ESLintOptions);
    return {
        [Syntax.CodeBlock](node) {
            if (availableLang.indexOf(node.lang) === -1) {
                return;
            }
            const raw = getSource(node);
            const code = getUntrimmedCode(node, raw);

            const resultLinting = engine.executeOnText(code, node.lang);
            if (resultLinting.errorCount === 0) {
                return;
            }
            const results = resultLinting.results;
            results.forEach(result => {
                result.messages.forEach(message => {
                    /*

                     1. ```js
                     2. CODE
                     3. ```

                     ESLint message line and column start with 1
                     */
                    if (options.ignoreParsingErrors && message.message.includes("Parsing error")) {
                      return;
                    }

                    const prefix = message.ruleId ? `${message.ruleId}: ` : "";
                    if (message.fix) {
                        const paddingIndex = raw.indexOf(code);
                        const fixedRange = message.fix.range;
                        const fixedText = message.fix.text;
                        const fixedWithPadding = [fixedRange[0] + paddingIndex, fixedRange[1] + paddingIndex];
                        report(node, new RuleError(`${prefix}${message.message}`, {
                            line: message.line,
                            column: message.column - 1,
                            fix: fixer.replaceTextRange(fixedWithPadding, fixedText)
                        }));
                    } else {
                        report(node, new RuleError(`${prefix}${message.message}`, {
                            line: message.line,
                            column: message.column - 1
                        }));
                    }

                });
            });
        }
    }
};

/**
 * get actual code value from CodeBlock node
 * @param {Object} node
 * @param {string} raw raw value include CodeBlock syntax
 * @returns {string}
 */
function getUntrimmedCode(node, raw) {
    if (node.type !== "CodeBlock") {
        return node.value
    }

    // Space indented CodeBlock that has not lang
    if (!node.lang) {
        return node.value;
    }

    // https://github.com/wooorm/remark/issues/207#issuecomment-244620590
    const lines = raw.split("\n");

    // code lines without the first line and the last line
    const codeLines = lines.slice(1, lines.length - 1);

    // add last new line
    // \n```
    return codeLines.join("\n") + "\n";
}

module.exports = {
    linter: reporter,
    fixer: reporter
};