import type {
	AssertMessageFunction,
} from 'assert';
import assert from 'assert';

import type {
	Node,
	NodeArray,
} from '@typescript/typescript6';

export type AssertMessage = (
	| string
	| Error
	| AssertMessageFunction
);

function value_is_non_array_object(
	maybe: unknown,
): maybe is {[key: string]: unknown} {
	return (
		'object' === typeof maybe
		&& !(maybe instanceof Array)
		&& null !== maybe
	);
}

function maybe_Message(
	maybe?: (
		| string
		| Error
		| AssertMessageFunction
	),
): (
	| undefined
	| Exclude<AssertMessage, string>
) {
	if ('string' === typeof maybe) {
		return () => maybe;
	}

	return maybe;
}

export function array_has_size(
	maybe: unknown[]|NodeArray<Node>,
	size: number,
	message?: AssertMessage,
): asserts maybe is ((unknown[]) & {length: typeof size}) {
	assert.strictEqual(
		maybe.length,
		size,
		maybe_Message(message),
	);
}

export function is_instanceof<T>(
	maybe: unknown,
	of: {
		[Symbol.hasInstance](instance: unknown): boolean,
	},
	message?: AssertMessage,
): asserts maybe is T & typeof of {
	assert.strictEqual(
		maybe instanceof of,
		true,
		maybe_Message(message),
	);
}

export function not_undefined<T = unknown>(
	maybe: T|undefined,
	message?: AssertMessage,
): asserts maybe is Exclude<typeof maybe, undefined> {
	assert.strictEqual(
		undefined !== maybe,
		true,
		maybe_Message(message),
	);
}

export function object_has_property(
	maybe: unknown,
	property: string,
	message?: AssertMessage,
): asserts maybe is (
	& {[key: string]: unknown}
	& {[key in typeof property]: unknown}
) {
	assert.strictEqual(
		typeof maybe,
		'object',
		maybe_Message(message),
	);
	assert.strictEqual(
		maybe instanceof Array,
		false,
		maybe_Message(message),
	);
	assert.strictEqual(
		property in (maybe as {[key: string]: unknown}),
		true,
		maybe_Message(message),
	);
}

function resolve_partial(
	actual: {[key: string]: unknown},
	expecting: {[key: string]: unknown},
	message?: AssertMessage,
): {[key: string]: unknown} {
	const partial_match: {[key: string]: unknown} = {};

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
	message?: AssertMessage,
): Promise<void> {
	let failure: unknown = undefined;

	await assert.rejects(maybe);
	await maybe.catch((err) => {
		failure = err;
	});
	assert.strictEqual(
		value_is_non_array_object(failure),
		true,
		maybe_Message(message),
	);

	const partial_match: {[key: string]: unknown} = resolve_partial(
		failure as {[key: string]: unknown},
		partial_error,
		message,
	);

	assert.deepStrictEqual(
		partial_match,
		partial_error,
		maybe_Message(message),
	);
}
