// LICENSE : MIT
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const textlint_rule_eslint_js_1 = __importDefault(require("../src/textlint-rule-eslint.js"));
const textlint_tester_1 = __importDefault(require("textlint-tester"));
const path_1 = __importDefault(require("path"));
const tester = new textlint_tester_1.default();
const configFilePath = path_1.default.join(__dirname, "fixtures/style.eslintconfig.js");
const WrongCode1 = "var a = 1";
const WrongCode2 = "var a = 1; var b = 2";
// @ts-expect-error
tester.run("textlint-rule-eslint", textlint_rule_eslint_js_1.default, {
    valid: [
        {
            text: "`var a = 1;`",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n" +
                "var a = 1;\n" +
                "```",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n\n" +
                "var a = 1;\n\n" +
                "```",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n\n" +
                "+++1+++\n" +
                "```",
            options: {
                configFile: configFilePath,
                ignoreParsingErrors: true
            }
        },
    ],
    invalid: [
        {
            text: "```js\n" +
                "+++1+++\n" +
                "```",
            errors: [
                {
                    message: "Parsing error: Assigning to rvalue",
                    line: 2,
                    column: 4
                }
            ],
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n" +
                WrongCode1 + "\n" +
                "```",
            output: "```js\n" +
                WrongCode1 + ";\n" +
                "```",
            errors: [
                {
                    message: "semi: Missing semicolon.",
                    line: 2,
                    column: 10
                }
            ],
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```javascript\n" +
                "var a = 1\n" +
                "var b = 2\n" +
                "```",
            output: "```javascript\n" +
                "var a = 1;\n" +
                "var b = 2;\n" +
                "```",
            errors: [
                {
                    message: "semi: Missing semicolon.",
                    line: 2,
                    column: 10
                },
                {
                    message: "semi: Missing semicolon.",
                    line: 3,
                    column: 10
                }
            ],
            options: {
                configFile: configFilePath
            }
        },
        // multiple
        {
            text: "```js\n" +
                WrongCode1 + "\n" +
                "```\n" +
                "This is text.\n" +
                "```js\n" +
                WrongCode2 + "\n" +
                "```",
            output: "```js\n" +
                WrongCode1 + ";\n" +
                "```\n" +
                "This is text.\n" +
                "```js\n" +
                WrongCode2 + ";\n" +
                "```",
            errors: [
                {
                    message: "semi: Missing semicolon.",
                    line: 2,
                    column: 10
                }, {
                    message: "semi: Missing semicolon.",
                    line: 6,
                    column: 21
                }
            ],
            options: {
                configFile: configFilePath
            }
        }
    ]
});
