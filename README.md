[![Coverage Status](https://coveralls.io/repos/github/Satisfactory-Clips-Archive/Custom-Assert/badge.svg?branch=main)](https://coveralls.io/github/Satisfactory-Clips-Archive/Custom-Assert?branch=main)
[![Workflow Status](https://github.com/Satisfactory-Clips-Archive/Custom-Assert/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/Satisfactory-Clips-Archive/Custom-Assert/actions/workflows/node.js.yml?query=branch%3Amain)

# Development

## Requirements

-   Docker
    -   recommend vscode devcontainer support
    -   phpstorm's devcontainer support works but doesn't seem as capable

## Instructions

1. Checkout locally
1. Load in devcontainer-supporting IDE
    - devcontainer setup should automatically run `make install`
    - `NODE_OPTIONS` env var may require opening a fresh terminal if you
      receieve an error along the lines of
      `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"`

# Usage

1. run `npm install --save @satisfactory-clips-archive/custom-assert`
1. integrate with testing solution

## Example

Taken from project tests

```ts
import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	array_has_size,
} from '@satisfactory-clips-archive/custom-assert';

void describe('array_has_size', () => {
	void it('does not throw', () => {
		assert.doesNotThrow(() => array_has_size([], 0));
		assert.doesNotThrow(() => array_has_size(['foo'], 1));
	});
	void it('does throw', () => {
		assert.throws(() => array_has_size([], 1));
		assert.throws(() => array_has_size([1], 0));
	});
});
```

# License

[see LICENSE.md](LICENSE.md)
