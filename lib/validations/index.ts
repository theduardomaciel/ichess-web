// Types
import { type UseFormReturn } from "react-hook-form";

export function isValid(
	key: string,
	section: number,
	form: UseFormReturn<any>
) {
	const errors = form.formState.errors as Record<string, any>;

	/// Important: Make sure to provide defaultValues at the useForm, so hook form can have a single source of truth to compare each field's dirtiness - from the docs
	return (
		form.formState.dirtyFields[`section${section}`]?.[key] &&
		!errors[`section${section}`]?.[key]
	);
}

export function goToNextSection(newSection: number, router: any) {
	router.replace(`?section=${newSection}`, {
		scroll: false,
	});
	document.getElementById(`section${newSection}`)?.scrollIntoView({
		behavior: "smooth",
	});
}
