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
			(memberOnEvent) => !membersIds.includes(memberOnEvent),
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

		const membersIdsToAdd = currentMembersIds.filter(
			(memberOnEvent) => !currentMembersIds.includes(memberOnEvent),
		);

		return { idsToAdd: membersIdsToAdd, idsToRemove: membersIdsToRemove };
	}
}
