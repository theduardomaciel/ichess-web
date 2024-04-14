export const transformSingleToArray = <T>(value: T | T[] | undefined): T[] =>
	Array.isArray(value) ? value : value ? [value] : [];
