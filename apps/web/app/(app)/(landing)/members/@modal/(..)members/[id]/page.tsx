import { MemberCard, MemberCardModal } from "@/components/members/MemberCard";

export default function MemberModal({
	params: { id: memberId },
}: {
	params: { id: string };
}) {
	return (
		<MemberCardModal>
			<MemberCard id={memberId} />
		</MemberCardModal>
	);
}
