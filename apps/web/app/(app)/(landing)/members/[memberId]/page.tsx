import { MemberCard } from "@/components/members/MemberCard";
import { Dialog } from "@/components/ui/dialog";

export default async function MemberPage(
    props: {
        params: Promise<{ memberId: string }>;
    }
) {
    const params = await props.params;

    const {
        memberId
    } = params;

    return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 px-wrapper pb-12 pt-32 lg:pb-0 lg:pt-24">
			<Dialog>
				<MemberCard id={memberId} variant="brighter" />
			</Dialog>
		</div>
	);
}
