# textlint-rule-eslint [![Build Status](https://travis-ci.org/azu/textlint-rule-eslint.svg?branch=master)](https://travis-ci.org/azu/textlint-rule-eslint) [![textlint fixable rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)


[textlint](https://textlint.github.io/ "textlint official site") rule integrate with ESLint.

## UseCase

ESLint can lint markdown file using [eslint/eslint-plugin-markdown](https://github.com/eslint/eslint-plugin-markdown "eslint/eslint-plugin-markdown").
But, eslint-plugin-markdown don't support disabling Markdown(HTML) comment for ignoring some CodeBlock.

[textlint](https://textlint.github.io/ "textlint official site") can filter specified CodeBlock using [textlint-filter-rule-comments](https://github.com/textlint/textlint-filter-rule-comments "textlint-filter-rule-comments").

    <!-- textlint-disable -->

    ```js
    var ignore = "This is ignored"
    ```

    <!-- textlint-enable -->


Sometimes, we want to write broken JavaScript code into JS CodeBlock for Syntax Highlight.


    This is error example of parsing:

    <!-- textlint-disable eslint -->

    ```js
    // This is invalid example
    const const;
    ```

    <!-- textlint-enable eslint -->

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-rule-eslint eslint

## Usage


Via `.textlintrc`(Recommended)

```js
{
    "rules": {
        "eslint": {
          // Required: path to .eslintrc file
          "configFile": "path/to/.eslintrc"
        }
    }
}
```

Via CLI

```
textlint --rule eslint README.md
```

## Options

- `configFile`: string
    - **Required**
    - path to .eslintrc file
- `langs`: `string[]`
    - recognize lang of CodeBlock

```js
{
    "rules": {
        "eslint": {
            // Required: path to .eslintrc file
            "configFile": "path/to/.eslintrc",
            // recognize lang of CodeBlock
            "langs": ["js", "javascript", "node", "jsx"]
        }
    }
}
```

## Fixable

`textlint-rule-eslint support` `--fix` option.

[![textlint rule](https://img.shields.io/badge/textlint-fixable-green.svg?style=social)](https://textlint.github.io/)

See [https://github.com/textlint/textlint/#fixable](https://github.com/textlint/textlint/#fixable) for more details.

## Changelog

See [Releases page](https://github.com/azu/textlint-rule-eslint/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/textlint-rule-eslint/issues).

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
