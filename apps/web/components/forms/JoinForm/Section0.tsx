"use client";
import Link from "next/link";

// Icons
import ManageAccountIcon from "@/public/icons/manage_account.svg";

// Components
import {
	FormSection,
	SectionFooter,
	Panel,
	type GenericForm,
} from "@/components/forms";
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { GoogleButton } from "@/components/auth/SignInButton";

export default function JoinForm0({
	form,
	email,
}: { form: GenericForm; email?: string | null }) {
	return (
		<FormSection
			title="Identificação"
			section={0}
			form={form}
			fields={[
				{
					name: "E-mail institucional",
					value: !!email,
				},
			]}
		>
			<FormField
				control={form.control}
				name="section0.email"
				render={() => (
					<FormItem>
						<FormLabel>E-mail institucional</FormLabel>
						<GoogleButton
							disabled={!!email}
							className="w-full py-[1.35rem]"
							callbackUrl="/join"
						/>
						{email && (
							<Panel type="success" showIcon>
								Você está logado como <strong>{email}</strong>.
								<Link
									href="/auth"
									className="absolute top-1/2 right-4 -translate-y-1/2"
								>
									<ManageAccountIcon width={22} height={22} />
								</Link>
							</Panel>
						)}
						<FormMessage type="warning" showIcon />
					</FormItem>
				)}
			/>
			<SectionFooter>
				{/* {email && (
					<button
						type="button"
						className="transition-colors hover:text-tertiary-100 hover:underline"
					>
						Sair da conta
					</button>
				)} */}
			</SectionFooter>
		</FormSection>
	);
}
