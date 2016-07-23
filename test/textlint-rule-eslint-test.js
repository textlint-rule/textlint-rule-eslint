// LICENSE : MIT
"use strict";
import rule from "../src/textlint-rule-eslint";
const path = require("path");
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
const configFilePath = path.join(__dirname, "fixtures/style.eslintconfig.js");
const WrongCode1 = "var a = 1";
const WrongCode2 = "var a = 1; var b = 2";
tester.run("textlint-rule-eslint", rule, {
    valid: [
        {
            text: "`var a = 1;`",
            options: {
                configFile: configFilePath
            }
        }
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