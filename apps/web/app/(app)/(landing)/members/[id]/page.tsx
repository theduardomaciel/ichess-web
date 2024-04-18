import { MemberCard } from "@/components/members/MemberCard/Modal";

export default function PhotoModal({
	params: { id: memberId },
}: {
	params: { id: string };
}) {
	return (
		<div className="grid gap-4 py-4">
			<MemberCard id={memberId} />
		</div>
	);
}
