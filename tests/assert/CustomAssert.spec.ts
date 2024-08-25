import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	array_has_size,
	is_instanceof,
	not_undefined,
	object_has_property,
	rejects_partial_match,
} from '../../assert/CustomAssert';

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

void describe('is_instanceof', () => {
	void it('does not throw', () => {
		assert.doesNotThrow(() => is_instanceof([], Array));
	});
	void it('does throw', () => {
		assert.throws(() => is_instanceof(1, Array));
	});
});

void describe('not_undefined', () => {
	void it('does not throw', () => {
		assert.doesNotThrow(() => not_undefined([]));
	});
	void it('does throw', () => {
		assert.throws(() => not_undefined(undefined));
	});
});

void describe('object_has_property', () => {
	void it('does not throw', () => {
		assert.doesNotThrow(() => object_has_property({foo: 1}, 'foo'));
	});
	void it('does throw', () => {
		assert.throws(() => object_has_property(undefined, 'foo'));
		assert.throws(() => object_has_property([], 'foo'));
		assert.throws(() => object_has_property({bar: 1}, 'foo'));
	});
});

void describe('rejects_partial_match', () => {
	void it('does not throw', async () => {
		await assert.doesNotReject(
			rejects_partial_match(
				new Promise((yup, nope) => {
					nope(Object.assign(new Error(), {
						foo: 1,
						bar: 2,
						baz: {
							foo: 3,
							bar: {
								foo: 4,
							},
						},
					}));
				}),
				{
					bar: 2,
					baz: {
						foo: 3,
					},
				},
			),
		);
	});
	void it('does throw', async() => {
		await assert.rejects(
			rejects_partial_match(
				new Promise((yup, nope) => {
					nope(Object.assign(new Error(), {
						foo: 1,
						bar: 2,
						baz: {
							foo: 3,
							bar: {
								foo: 4,
							},
						},
					}));
				}),
				{
					foo: 2,
				},
			),
		);
	});
});
