// LICENSE : MIT
"use strict";
module.exports = {
    rules: {
        "eol-last": ["error", "always"],
        "indent": ["error", 4, {
            "SwitchCase": 1
        }],
        "quotes": ["error", "double"],
        "key-spacing": "error",
        "keyword-spacing": "error",
        "linebreak-style": ["error", "unix"],
        "rest-spread-spacing": "error",
        "semi": ["error", "always"],
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": ["error", "never"],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": "error",
        "spaced-comment": ["error", "always", {
            "exceptions": ["-", "="],
            "markers": [
                "eslint",
                "eslint-env",
                "eslint-disable",
                "eslint-enable",
                "eslint-disable-line",
                "eslint-disable-next-line",
                "exported",
                "globals",
                "istanbul"
            ]
        }]
    }
};
