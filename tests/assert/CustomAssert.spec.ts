import {
	describe,
	it,
} from 'node:test';
import assert from 'node:assert/strict';
import {
	array_has_size,
	is_instanceof,
	not_undefined,
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
