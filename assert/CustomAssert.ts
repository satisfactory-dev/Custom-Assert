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

export function not_undefined<T = unknown>(
	maybe:T|undefined,
	message?:string|Error
) : asserts maybe is Exclude<typeof maybe, undefined> {
	assert.equal(undefined !== maybe, true, message);
}
