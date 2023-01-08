// LICENSE : MIT
"use strict";
import path from "path";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types"
import { StructuredSource } from "structured-source";
import { ESLint } from "eslint";

const defaultOptions = {
    // path to .eslintrc file
    "configFile": null,
    // recognize lang of CodeBlock
    "langs": ["js", "javascript", "node", "jsx"]
};
const getConfigBaseDir = (context: TextlintRuleContext & { config?: any }) => {
    if (typeof context.getConfigBaseDir === "function") {
        return context.getConfigBaseDir();
    }
    // Fallback that use deprecated `config` value
    // https://github.com/textlint/textlint/issues/294
    const textlintRcFilePath = context.config ? context.config.configFile : null;
    // .textlinrc directory
    return textlintRcFilePath ? path.dirname(textlintRcFilePath) : process.cwd();
};

export type Options = {
    configFile: string;
    langs: string[]
}
const reporter: TextlintRuleModule<Options> = (context, options) => {
    const { Syntax, RuleError, report, fixer, getSource, getFilePath} = context;
    if (!options) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    if (!options.configFile) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    const availableLang = options.langs || defaultOptions.langs;
    const textlintRCDir = getConfigBaseDir(context);
    const esLintConfigFilePath = textlintRCDir ? path.resolve(textlintRCDir, options.configFile) : options.configFile;
    const engine = new ESLint({
        useEslintrc: false,
        overrideConfigFile: esLintConfigFilePath
    });
    return {
        async [Syntax.CodeBlock](node) {
            if (availableLang.indexOf(node.lang) === -1) {
                return;
            }
            const raw = getSource(node);
            const code = getUntrimmedCode(node, raw);
            const source = new StructuredSource(code);
            const resultLinting = await engine.lintText(code, {
                filePath: `test.${node.lang}`
            });
            if (resultLinting.length === 0) {
                return;
            }
            resultLinting.forEach(result => {
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
                        const fixedRange = message.fix.range;
                        const fixedText = message.fix.text;
                        const sourceBlockDiffIndex = (raw !== node.value) ? raw.indexOf(code) : 0;
                        const fixedWithPadding = [fixedRange[0] + sourceBlockDiffIndex, fixedRange[1] + sourceBlockDiffIndex] as const;
                        const index = source.positionToIndex({
                            line: message.line,
                            column: message.column
                        });
                        const adjustedIndex = index + sourceBlockDiffIndex - 1;
                        report(node, new RuleError(`${prefix}${message.message}`, {
                            index: adjustedIndex,
                            fix: fixer.replaceTextRange(fixedWithPadding as [number, number], fixedText)
                        }));
                    } else {
                        const sourceBlockDiffIndex = (raw !== node.value) ? raw.indexOf(code) : 0;
                        const index = source.positionToIndex({
                            line: message.line,
                            column: message.column
                        });
                        const adjustedIndex = index + sourceBlockDiffIndex - 1;
                        report(node, new RuleError(`${prefix}${message.message}`, {
                            index: adjustedIndex
                        }));
                    }

                });
            });
        }
    }
};

/**
 * [Markdown] get actual code value from CodeBlock node
 * @param {Object} node
 * @param {string} raw raw value include CodeBlock syntax
 * @returns {string}
 */
function getUntrimmedCode(node: any, raw: string) {
    if (node.type !== "CodeBlock") {
        return node.value
    }
    // Space indented CodeBlock that has not lang
    if (!node.lang) {
        return node.value;
    }

    // If it is not markdown codeBlock, just use node.value
    if (!(raw.startsWith("```") && raw.endsWith("```"))) {
        if (node.value.endsWith("\n")) {
            return node.value
        }
        return node.value + "\n";
    }
    // Markdown(remark) specific hack
    // https://github.com/wooorm/remark/issues/207#issuecomment-244620590
    const lines = raw.split("\n");
    // code lines without the first line and the last line
    const codeLines = lines.slice(1, lines.length - 1);
    // add last new line
    // \n```
    return codeLines.join("\n") + "\n";
}

export default {
    linter: reporter,
    fixer: reporter
};
