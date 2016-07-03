// LICENSE : MIT
"use strict";
const CLIEngine = require("eslint").CLIEngine;
const path = require("path");
const defaultOptions = {
    // path to .eslintrc file
    configFile: null,
    // recognize lang of CodeBlock
    langs: ["js", "javascript", "node", "jsx"]
};
module.exports = function (context, options) {
    const {Syntax, RuleError, report, getSource} = context;
    if(!options.configFile) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    const availableLang = options.langs || defaultOptions.langs;
    const filePath = context.getFilePath();
    const textlintRcFilePath = context.config ? context.config.configFile : null;
    const textlintRCDir = textlintRcFilePath ? path.dirname(textlintRcFilePath) : process.cwd();
    const extname = path.extname(filePath);
    const ESLintOptions = {
        configFile: path.resolve(textlintRCDir, options.configFile)
    };
    const engine = new CLIEngine(ESLintOptions);
    return {
        [Syntax.CodeBlock](node){
            if (availableLang.indexOf(node.lang) === -1) {
                return;
            }
            const code = node.value;
            const resultLinting = engine.executeOnText(code, extname);
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
                    const error = new RuleError(`${message.ruleId}: ${message.message}`, {
                        line: message.line,
                        column: message.column - 1
                    });
                    report(node, error);
                });
            });
        }
    }
};