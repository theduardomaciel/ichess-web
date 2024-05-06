import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-extrabold ring-offset-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 ring-primary-200 ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2",
	{
		variants: {
			variant: {
				default:
					"bg-primary-100 text-white hover:bg-primary-100/90 hover:ring-2",
				destructive:
					"bg-tertiary-200 text-white hover:bg-tertiary-200/90 ring-tertiary-100 hover:ring-2",
				outline:
					"border border-neutral dark:border-input bg-transparent hover:bg-gray-300 hover:text-neutral",
				secondary: "bg-gray-200 text-neutral hover:bg-gray-200/80",
				modal: "bg-gray-600 text-neutral hover:bg-gray-600/70",
				ghost: "hover:bg-gray-300 hover:text-accent-foreground",
				link: "text-primary-200 underline-offset-4 hover:underline",
			},
			size: {
				default: "px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				xl: "h-12 rounded-md px-9",
				icon: "h-12 px-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading,
			disabled,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading || disabled}
				{...props}
			>
				{isLoading ? <Loader2 className="animate-spin" /> : children}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
