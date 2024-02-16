import * as React from "react";
import {
	ReadonlyURLSearchParams,
	usePathname,
	useSearchParams,
} from "next/navigation";

export function useQueryString() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setQuery = React.useCallback(
		(
			name: string,
			value: string,
			currentSearchParams?: ReadonlyURLSearchParams
		) => {
			const params = new URLSearchParams(
				currentSearchParams
					? currentSearchParams.toString()
					: searchParams.toString()
			);

			params.set(name, value);

			return params as ReadonlyURLSearchParams;
		},
		[searchParams]
	);

	const deleteQuery = React.useCallback(
		(name: string, currentSearchParams?: ReadonlyURLSearchParams) => {
			const params = new URLSearchParams(
				currentSearchParams
					? currentSearchParams.toString()
					: searchParams.toString()
			);

			params.delete(name);

			return params as ReadonlyURLSearchParams;
		},
		[searchParams]
	);

	const toUrl = React.useCallback(
		(params: ReadonlyURLSearchParams) => {
			return pathname + "?" + params.toString();
		},
		[pathname]
	);

	return {
		query: searchParams,
		setQuery,
		deleteQuery,
		toUrl,
	};
}
