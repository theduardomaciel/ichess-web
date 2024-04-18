import { MemberCard, MemberCardModal } from "@/components/members/MemberCard";

export default function MemberModal({
	params: { memberId },
}: {
	params: { memberId: string };
}) {
	return (
		<MemberCardModal>
			<MemberCard id={memberId} />
		</MemberCardModal>
	);
}
