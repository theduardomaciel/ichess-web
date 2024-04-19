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

interface GetMembersIdsToMutateProps {
	membersIds: string[];
	currentMembersIds: string[];
	mode: "full" | "partial";
}

export function getMembersIdsToMutate({
	membersIds,
	currentMembersIds,
	mode,
}: GetMembersIdsToMutateProps) {
	if (mode === "full") {
		// Quando todos os membros são passados, a diferença entre os membros atuais e os novos
		// é a lista de membros a serem adicionados e removidos
		const membersIdsToRemove = currentMembersIds.filter(
			(memberId) => !membersIds.includes(memberId),
		);

		const membersIdsToAdd = membersIds.filter(
			(memberId) => !currentMembersIds.includes(memberId),
		);

		return { idsToAdd: membersIdsToAdd, idsToRemove: membersIdsToRemove };
	} else {
		// Quando apenas alguns membros são passados, a diferença entre os membros atuais e os novos
		// é a lista de membros a serem adicionados e removidos
		const membersIdsToRemove = membersIds.filter((memberId) =>
			currentMembersIds.includes(memberId),
		);

		const membersIdsToAdd = membersIds.filter(
			(memberId) => !currentMembersIds.includes(memberId),
		);

		return { idsToAdd: membersIdsToAdd, idsToRemove: membersIdsToRemove };
	}
}

export function getPeriodsInterval(
	periods:
		| {
				from: Date;
				to: Date;
		  }[]
		| undefined,
) {
	if (!periods) {
		return { dateFrom: undefined, dateTo: undefined };
	}

	const dateFrom =
		periods && periods.length > 0
			? periods
					.map((period) => period.from)
					.reduce((acc, date) => {
						return acc < date ? acc : date;
					})
			: undefined;

	const dateTo =
		periods && periods.length > 0
			? periods
					.map((period) => period.to)
					.reduce((acc, date) => {
						return acc > date ? acc : date;
					})
			: undefined;

	return { dateFrom, dateTo };
}
