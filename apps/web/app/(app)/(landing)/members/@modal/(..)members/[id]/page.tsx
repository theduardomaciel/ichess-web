import { MemberCard } from "@/components/members/MemberCard/Modal";

export default function PhotoModal({
	params: { id: memberId },
}: {
	params: { id: string };
}) {
	return <MemberCard id={memberId} />;
}
