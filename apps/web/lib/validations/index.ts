// Schemas
import { JoinFormSchema } from "./JoinForm";
import { MutateEventFormSchema } from "./MutateEventForm";
import { PresenceFormSchema } from "./PresenceForm";

// Types
import { FormState, type UseFormReturn } from "react-hook-form";

type FormSchema = JoinFormSchema | MutateEventFormSchema | PresenceFormSchema;

export function isValid(
	key: string,
	section: number,
	form: UseFormReturn<FormSchema>,
) {
	const dirtyFields = form.formState.dirtyFields;
	const errors = form.formState.errors;

	const currentSection =
		`section${section}` as keyof FormState<FormSchema>["dirtyFields"];
	// | keyof FormState<FormSchema>["errors"]

	/// Importante: "Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness" - da documentação do react-hook-form
	return dirtyFields[currentSection]?.[key] && !errors[currentSection]?.[key];
}

/* 
form.formState.dirtyFields[`section${section}`]?.[key] &&
		!errors[`section${section}`]?.[key]
*/

export function scrollToNextSection(newSection: number) {
	document.getElementById(`section${newSection}`)?.scrollIntoView({
		behavior: "smooth",
	});
}
