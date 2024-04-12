"use client";

// Components
import {
	type FormProps,
	FormSection,
	SectionFooter,
	Panel,
} from "@/components/forms";
import { GoogleButton } from "@/app/auth/sign-in/SignInButton";

export default function JoinForm0({
	form,
	email,
}: FormProps & { email?: string }) {
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
			<GoogleButton className="w-full py-5" callbackUrl="/join" />
			{email && (
				<Panel type="success" showIcon>
					Você está logado como <strong>{email}</strong>.
				</Panel>
			)}
			<SectionFooter />
		</FormSection>
	);
}
