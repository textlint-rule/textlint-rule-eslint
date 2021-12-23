// LICENSE : MIT
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const structured_source_1 = __importDefault(require("structured-source"));
const eslint_1 = require("eslint");
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
    return textlintRcFilePath ? path_1.default.dirname(textlintRcFilePath) : process.cwd();
};
const reporter = (context, options) => {
    const { Syntax, RuleError, report, fixer, getSource, getFilePath } = context;
    if (!options) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    if (!options.configFile) {
        throw new Error(`Require options: { "configFile": "path/to/.eslintrc" }`);
    }
    const availableLang = options.langs || defaultOptions.langs;
    const textlintRCDir = getConfigBaseDir(context);
    const esLintConfigFilePath = textlintRCDir ? path_1.default.resolve(textlintRCDir, options.configFile) : options.configFile;
    const engine = new eslint_1.ESLint({
        useEslintrc: false,
        overrideConfigFile: esLintConfigFilePath
    });
    return {
        [Syntax.CodeBlock](node) {
            return __awaiter(this, void 0, void 0, function* () {
                if (availableLang.indexOf(node.lang) === -1) {
                    return;
                }
                const raw = getSource(node);
                const code = getUntrimmedCode(node, raw);
                const source = new structured_source_1.default(code);
                const resultLinting = yield engine.lintText(code, {
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
                            const fixedWithPadding = [fixedRange[0] + sourceBlockDiffIndex, fixedRange[1] + sourceBlockDiffIndex];
                            const index = source.positionToIndex({
                                line: message.line,
                                column: message.column
                            });
                            const adjustedIndex = index + sourceBlockDiffIndex - 1;
                            report(node, new RuleError(`${prefix}${message.message}`, {
                                index: adjustedIndex,
                                fix: fixer.replaceTextRange(fixedWithPadding, fixedText)
                            }));
                        }
                        else {
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
            });
        }
    };
};
/**
 * [Markdown] get actual code value from CodeBlock node
 * @param {Object} node
 * @param {string} raw raw value include CodeBlock syntax
 * @returns {string}
 */
function getUntrimmedCode(node, raw) {
    if (node.type !== "CodeBlock") {
        return node.value;
    }
    // Space indented CodeBlock that has not lang
    if (!node.lang) {
        return node.value;
    }
    // If it is not markdown codeBlock, just use node.value
    if (!(raw.startsWith("```") && raw.endsWith("```"))) {
        if (node.value.endsWith("\n")) {
            return node.value;
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
exports.default = {
    linter: reporter,
    fixer: reporter
};
