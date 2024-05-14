"use client";

// Components
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

// Icons
import SuccessIcon from "@/public/icons/check_circle.svg";
import ErrorIcon from "@/public/icons/error.svg";
import WarningIcon from "@/public/icons/warning.svg";
import InfoIcon from "@/public/icons/info.svg";

const VARIANT_ICONS = {
	success: SuccessIcon,
	error: ErrorIcon,
	warning: WarningIcon,
	info: InfoIcon,
};

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({
				id,
				title,
				description,
				variant,
				action,
				...props
			}) => (
					<Toast key={id} variant={variant} {...props}>
						<div className="grid gap-1">
							{title && (
								<ToastTitle
									icon={
										VARIANT_ICONS[
											variant as keyof typeof VARIANT_ICONS
										]
									}
								>
									{title}
								</ToastTitle>
							)}
							{description && (
								<ToastDescription>
									{description}
								</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				))}
			<ToastViewport />
		</ToastProvider>
	);
}
