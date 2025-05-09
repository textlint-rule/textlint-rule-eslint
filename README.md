# textlint-rule-eslint [![Actions Status: test](https://github.com/textlint-rule/textlint-rule-eslint/workflows/test/badge.svg)](https://github.com/textlint-rule/textlint-rule-eslint/actions?query=workflow%3A"test")

[textlint](https://textlint.github.io/ "textlint official site") rule to lint JavaScript in Markdown with ESLint.

> [!WARNING]
> Now you can Lint CodeBlock code in ESLint by using [@eslint/markdown](https://github.com/eslint/markdown).
> Therefore, this rule is maintenance mode


## Use case

ESLint can lint Markdown files using [eslint-plugin-markdown](https://github.com/eslint/eslint-plugin-markdown "eslint/eslint-plugin-markdown"). But eslint-plugin-markdown doesn't support disabling Markdown (HTML) comments for ignoring some CodeBlocks.

[textlint](https://textlint.github.io/ "textlint official site") can filter some CodeBlocks using [textlint-filter-rule-comments](https://github.com/textlint/textlint-filter-rule-comments "textlint-filter-rule-comments"):

    <!-- textlint-disable -->

    ```js
    var ignore = "This is ignored"
    ```

    <!-- textlint-enable -->


Sometimes, we want to write broken JavaScript code into a JS CodeBlock for syntax highlight:


    This is error example of parsing:

    <!-- textlint-disable eslint -->

    ```js
    // This is invalid example
    const const;
    ```

    <!-- textlint-enable eslint -->

To ignore ESLint parsing errors that cannot be ignored from the config file, you can use `ignoreParsingErrors`:

```json5
{
    "rules": {
        "eslint": {
          "configFile": "path/to/.eslintrc",
          "ignoreParsingErrors": true
        }
    }
}
```

## Installation

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-eslint eslint

Support Versions:

- `textlint-rule-eslint@5`: Support ESLint 9
- `textlint-rule-eslint@4`: Support ESLint 8

## Usage


Via `.textlintrc` (recommended):

```json5
{
    "rules": {
        "eslint": {
          // Required: path to eslint.config file
          "configFile": "./path/to/eslint.config.mjs"
        }
    }
}
```

Via CLI:

```
textlint --rule eslint README.md
```

## Options

- `configFile`: string
    - **Required**
    - path to .eslintrc file
- `langs`: `string[]`
    - Default: `["js", "javascript", "node", "jsx"]`
    - recognize lang of CodeBlock
- `ignoreParsingErrors`: `Boolean`
    - Default: `false`
    - ignore ESLint parsing errors while still reporting other ESLint errors

```json5
{
    "rules": {
        "eslint": {
            // Required: path to eslint.config file
            "configFile": "./path/to/eslint.config.mjs",
            // recognize lang of CodeBlock as JavaScript
            "langs": ["js", "javascript", "node", "jsx"],
            // Ignore ESLint parsing errors
            "ignoreParsingErrors": true
        }
    }
}
```

## Fixable

`textlint-rule-eslint support` `--fix` option.

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

See [https://github.com/textlint/textlint/#fixable](https://github.com/textlint/textlint/#fixable) for more details.

## Changelog

See [Releases page](https://github.com/textlint-rule/textlint-rule-eslint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm ci && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/textlint-rule/textlint-rule-eslint/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
