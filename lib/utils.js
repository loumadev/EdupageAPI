// @ts-nocheck
const btoa = data => Buffer.from(data).toString("base64");
const atob = data => Buffer.from(data, "base64").toString();

/**
 * Create iterable key-value pairs.
 * @param {any} iterable Iterable Object, Array or any other value.
 * @returns {([index: number, key: string, value: any] | [index: number, value: any])[]} Iterator
 * @example
 * iterate([4, 5, 6]); //[[0, 4], [1, 5], [2, 6]]
 * iterate([]); //[]
 * iterate({a: 4, b: 5, c: 6}); //[[0, "a", 4], [1, "b", 5], [2, "c", 6]]
 * iterate({}); //[]
 * iterate("bar"); //[[0, "b"], [1, "a"], [2, "r"]]
 * iterate(11); //[[0, 11]]
 * iterate(true); //[[0, true]]
 * iterate(false); //[[0, false]]
 * iterate(null); //[]
 * iterate(undefined); //[]
 */
function iterate(iterable) {
	if(iterable === undefined || iterable === null) return [];
	if(iterable instanceof Array || typeof iterable === "string" && (iterable = [...iterable])) return iterable.entries();
	else {
		const iterator = Object.entries(iterable).map((value, i) => [i, ...value]);
		return iterator.length || iterable.constructor === Object ? iterator : [[0, iterable]];
	}
}

Object.reduce = function(object, callbackfn, initialValue = Object.values(object)[0]) {
	const keys = Object.keys(object);
	let previousValue = initialValue;
	let currentIndex;

	if(typeof callbackfn !== "function")
		throw new TypeError(callbackfn + " is not a function");
	if(typeof initialValue === "undefined" && !keys.length)
		throw new TypeError("Reduce of empty object with no initial value");

	for(currentIndex = +(initialValue == Object.values(object)[0]); currentIndex < keys.length; currentIndex++) {
		var key = keys[currentIndex];
		var value = object[key];
		previousValue = callbackfn(
			previousValue,
			{key, value},
			currentIndex,
			object
		);
	}

	return previousValue;
}

module.exports = {
	btoa,
	atob,
	iterate
};