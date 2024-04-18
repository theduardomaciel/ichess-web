export const transformSingleToArray = (
	value: string | string[] | undefined,
): string[] | undefined => {
	if (value && Array.isArray(value)) {
		return value;
	} else {
		const splitted = value
			?.toString()
			.split(",")
			.map((v) => v.trim());

		return splitted ?? undefined;
	}
};
