// LICENSE : MIT
"use strict";
import rule from "../src/textlint-rule-eslint";
import TextLintTester from "textlint-tester";
import path from "path";

const tester = new TextLintTester();
const configFilePath = path.join(__dirname, "fixtures/style.eslintconfig.js");
const WrongCode1 = "var a = 1";
const WrongCode2 = "var a = 1; var b = 2";
// @ts-expect-error
tester.run("textlint-rule-eslint", rule, {
    valid: [
        {
            text: "`var a = 1;`",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n" + "var a = 1;\n" + "```",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```\n\n" + "++++++" + "```",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n\n" + "var a = 1;\n\n" + "```",
            options: {
                configFile: configFilePath
            }
        },
        {
            text: "```js\n\n" + "+++1+++\n" + "```",
            options: {
                configFile: configFilePath,
                ignoreParsingErrors: true
            }
        }
    ],
    invalid: [
        {
            text: "```js\n" + "+++1+++\n" + "```",
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
            text: "```js\n" + WrongCode1 + "\n" + "```",
            output: "```js\n" + WrongCode1 + ";\n" + "```",
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
            text: "```javascript\n" + "var a = 1\n" + "var b = 2\n" + "```",
            output: "```javascript\n" + "var a = 1;\n" + "var b = 2;\n" + "```",
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
        // no-dupe-keys error
        // It test that report range as error
        {
            text: `
\`\`\`js
var foo = {
    bar: "baz",
    bar: "qux"
};
\`\`\`
`,
            errors: [
                {
                    message: "no-dupe-keys: Duplicate key 'bar'.",
                    range: [40, 43]
                }
            ],
            options: {
                configFile: configFilePath
            }
        },
        // multiple
        {
            text: "```js\n" + WrongCode1 + "\n" + "```\n" + "This is text.\n" + "```js\n" + WrongCode2 + "\n" + "```",
            output:
                "```js\n" + WrongCode1 + ";\n" + "```\n" + "This is text.\n" + "```js\n" + WrongCode2 + ";\n" + "```",
            errors: [
                {
                    message: "semi: Missing semicolon.",
                    line: 2,
                    column: 10
                },
                {
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
