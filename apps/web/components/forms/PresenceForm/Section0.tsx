"use client";

// Components
import {
	FormSection,
	SectionFooter,
	type GenericForm,
} from "@/components/forms";
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { GoogleButton } from "@/components/auth/SignInButton";
import { Logged } from "@/components/auth/LoginStatus";

// Validation
import { isValid } from "@/lib/validations";
import {
	type PresenceFormSection0Schema,
	presenceFormSection0Schema,
} from "@/lib/validations/PresenceForm/section0";

const section0Keys = Object.keys(
	presenceFormSection0Schema.shape,
) as (keyof PresenceFormSection0Schema)[];

const formTitles = {
	email: "E-mail institucional",
	rememberMe: undefined,
};

export default function PresenceForm0({
	form,
	email,
}: { form: GenericForm; email?: string | null }) {
	const formSection = form.watch("formType");

	const section0 = section0Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 0, form),
		};
	});

	return (
		<FormSection
			title="Identificação"
			section={0}
			form={form}
			fields={section0}
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
						{email && <Logged email={email} />}
						<FormMessage type="warning" showIcon />
					</FormItem>
				)}
			/>
			<SectionFooter />
		</FormSection>
	);
}
