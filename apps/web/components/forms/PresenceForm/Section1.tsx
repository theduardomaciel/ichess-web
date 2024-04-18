"use client";

// Components
import { type FormProps, FormSection, SectionFooter } from "@/components/forms";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

// Validation
import { isValid } from "@/lib/validations";
import {
	type PresenceFormSection1Schema,
	presenceFormSection1Schema,
} from "@/lib/validations/PresenceForm/section1";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { GoogleButton } from "@/components/auth/SignInButton";

const section1Keys = Object.keys(
	presenceFormSection1Schema.shape,
) as (keyof PresenceFormSection1Schema)[];

const formTitles = {
	email: "E-mail institucional",
	rememberMe: undefined,
};

export default function PresenceForm1({ form }: FormProps) {
	const formSection = form.watch("formType");

	const section1 = section1Keys.map((key) => {
		return {
			name: formTitles[key],
			value: isValid(key, 1, form),
		};
	});

	return (
		<FormSection
			title="Identificação"
			section={1}
			form={form}
			fields={section1}
		>
			<FormField
				control={form.control}
				name="section1.email"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<GoogleButton className="w-full" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<SectionFooter>
				<FormField
					control={form.control}
					name="section1.rememberMe"
					render={({ field }) => (
						<FormItem className="w-auto">
							<div className="flex flex-row items-center justify-start gap-2">
								<FormControl>
									<Checkbox
										id={field.name}
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<Label
									className="line-clamp-2 overflow-hidden text-ellipsis leading-tight lg:text-sm"
									htmlFor={field.name}
								>
									Lembrar de mim
								</Label>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</SectionFooter>
		</FormSection>
	);
}
