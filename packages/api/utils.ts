export const transformSingleToArray = <T>(
	value: T | T[] | undefined,
): T[] | undefined => {
	if (Array.isArray(value)) {
		return value;
	}

	return value ? [value] : undefined;
};
