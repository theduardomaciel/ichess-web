"use client";

// Components
import {
	type FormProps,
	FormSection,
	SectionFooter,
	Panel,
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
}: FormProps & { email?: string | null }) {
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
							className="w-full py-[1.35rem]"
							callbackUrl="/join"
						/>
						{email && (
							<Panel type="success" showIcon>
								Você está logado como <strong>{email}</strong>.
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
