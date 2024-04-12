"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	useFormContext,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Panel, PanelProps } from "../forms";

// Icons
import ExclamationIcon from "@/public/icons/exclamation.svg";

const Form = FormProvider;

type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	);
};

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext);
	const itemContext = React.useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	const fieldState = getFieldState(fieldContext.name, formState);

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

const FormItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				ref={ref}
				className={cn("w-full space-y-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
	const { error, formItemId } = useFormField();

	return (
		<div className="flex flex-row items-center justify-start gap-2">
			<Label
				ref={ref}
				className={cn(/* error && "text-destructive", */ className)}
				htmlFor={formItemId}
				{...props}
			/>
			{error && <ExclamationIcon className="text-destructive" />}
		</div>
	);
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
	React.ElementRef<typeof Slot>,
	React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn(
				"change_later text-sm text-muted-foreground lg:text-base",
				className,
			)}
			{...props}
		/>
	);
});
FormDescription.displayName = "FormDescription";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
	type?: PanelProps["type"];
	showIcon?: PanelProps["showIcon"];
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
	({ className, children, type, showIcon, ...props }, ref) => {
		const { error, formMessageId } = useFormField();
		const body = error ? String(error?.message) : children;

		if (!body) {
			return null;
		}

		if (error?.type === "custom" && type) {
			return (
				<Panel
					type={type}
					showIcon={showIcon}
					className={className}
					{...props}
				>
					{body}
				</Panel>
			);
		}

		return (
			<p
				ref={ref}
				id={formMessageId}
				className={cn(
					"change_later text-sm font-medium text-destructive",
					className,
				)}
				{...props}
			>
				{body}
			</p>
		);
	},
);
FormMessage.displayName = "FormMessage";

export {
	useFormField,
	Form,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
	FormField,
};
