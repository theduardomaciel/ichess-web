import { z } from "zod";

import {
	type JoinFormSection0Schema,
	joinFormSection0Schema,
} from "@/lib/validations/JoinForm/section0";

export enum JoinFormTypeEnum {
	Section0 = "section0",
}

export const joinFormSchema = z.discriminatedUnion("formType", [
	z.object({
		formType: z.literal(JoinFormTypeEnum.Section0),
		section0: joinFormSection0Schema,
	}),
]);

export type JoinFormSchema = {
	formType: JoinFormTypeEnum;
	section0: JoinFormSection0Schema;
};
