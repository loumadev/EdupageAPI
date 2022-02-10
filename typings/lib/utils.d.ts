export function btoa(data: any): string;
export function atob(data: any): string;
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
export function iterate(iterable: any): ([index: number, key: string, value: any] | [index: number, value: any])[];
