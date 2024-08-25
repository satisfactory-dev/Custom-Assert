import assert from 'assert';
import {
	Node,
	NodeArray,
} from 'typescript';

function value_is_non_array_object(
	maybe: unknown,
): maybe is {[key: string]: unknown} {
	return (
		'object' === typeof maybe
		&& !(maybe instanceof Array)
		&& null !== maybe
	);
}

export function array_has_size(
	maybe:unknown[]|NodeArray<Node>,
	size:number,
	message?:string|Error,
): asserts maybe is ((unknown[]) & {length: typeof size}) {
	assert.strictEqual(maybe.length, size, message);
}

export function is_instanceof<T>(
	maybe:unknown,
	of: {
		[Symbol.hasInstance](instance:unknown): boolean;
	},
	message?:string|Error,
): asserts maybe is T & typeof of {
	assert.strictEqual(maybe instanceof of, true, message);
}

export function not_undefined<T = unknown>(
	maybe:T|undefined,
	message?:string|Error,
) : asserts maybe is Exclude<typeof maybe, undefined> {
	assert.strictEqual(undefined !== maybe, true, message);
}

export function object_has_property(
	maybe: unknown,
	property:string,
	message?:string|Error,
): asserts maybe is (
	& {[key: string]: unknown}
	& {[key in typeof property]: unknown}
) {
	assert.strictEqual(typeof maybe, 'object', message);
	assert.strictEqual(maybe instanceof Array, false, message);
	assert.strictEqual(
		property in (maybe as {[key: string]: unknown}),
		true,
		message,
	);
}

function resolve_partial(
	actual:{[key: string]: unknown},
	expecting:{[key: string]: unknown},
	message?:string|Error,
): {[key: string]: unknown} {
	const partial_match:{[key: string]: unknown} = {};

	for (const entry of Object.entries(expecting)) {
		const [property, expecting_value] = entry;
		object_has_property(actual, property, message);
		const actual_value = actual[property];
		if (
			value_is_non_array_object(actual_value)
			&& value_is_non_array_object(expecting_value)
		) {

			partial_match[property] = resolve_partial(
				actual_value,
				expecting_value,
			);
		} else {
			partial_match[property] = actual_value;
		}
	}

	return partial_match;
}

export async function rejects_partial_match(
	maybe: Promise<unknown>,
	partial_error: {[key: string]: unknown},
	message?:string|Error,
) : Promise<void> {
	let failure:unknown = undefined;

	await assert.rejects(maybe);
	await maybe.catch((err) => {failure = err});
	assert.strictEqual(
		value_is_non_array_object(failure),
		true,
		message,
	);

	const partial_match:{[key: string]: unknown} = resolve_partial(
		failure as {[key: string]: unknown},
		partial_error,
		message,
	);

	assert.deepStrictEqual(partial_match, partial_error, message);
}
