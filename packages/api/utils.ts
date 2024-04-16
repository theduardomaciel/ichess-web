export const transformSingleToArray = (
	value: string | undefined,
): string[] | undefined => {
	const splitted = value
		?.toString()
		.split(",")
		.map((v) => v.trim());

	return splitted ?? undefined;
};
