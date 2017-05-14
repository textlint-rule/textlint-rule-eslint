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
const reporter = (context, options) => {
    const {Syntax, RuleError, report, fixer, getSource} = context;
    if (!options.configFile) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    const availableLang = options.langs || defaultOptions.langs;
    const textlintRcFilePath = context.config ? context.config.configFile : null;
    const textlintRCDir = textlintRcFilePath ? path.dirname(textlintRcFilePath) : process.cwd();
    const ESLintOptions = {
        configFile: path.resolve(textlintRCDir, options.configFile)
    };
    const engine = new CLIEngine(ESLintOptions);
    return {
        [Syntax.CodeBlock](node){
            if (availableLang.indexOf(node.lang) === -1) {
                return;
            }
            const raw = getSource(node);
            const code = node.value + '\n';
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
module.exports = {
    linter: reporter,
    fixer: reporter
};