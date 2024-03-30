import assert from 'node:assert/strict';
import {
	Node,
	NodeArray,
} from 'typescript';

export function array_has_size(
	maybe:unknown[]|NodeArray<Node>,
	size:number,
	message?:string|Error
): asserts maybe is ((unknown[]) & {length: typeof size}) {
	assert.equal(maybe.length, size, message);
}

export function is_instanceof(
	maybe:unknown,
	of: {
		[Symbol.hasInstance](instance:unknown): boolean;
	},
	message?:string|Error
): asserts maybe is typeof of {
	assert.equal(maybe instanceof of, true, message);
}
