import * as z from "zod"

const schema = z
  .object({
    title: z.string().min(1, { message: "必須項目です" }).max(100, { message: "最大100文字です" }),
    description: z.string().max(2000, { message: "最大2000文字です" }).optional(),
    currency: z.string().superRefine((value, ctx) => {
      if (value === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "必須項目です" })
    }),
    from: z
      .array(
        z.object({
          id: z.string(),
          amount: z.number(),
        }),
      )
      .min(1, { message: "必須項目です" })
      .superRefine((values, ctx) => {
        for (const value of values) {
          if (value.id === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未選択の人の欄があります" })
          if (value.amount === Number.MIN_SAFE_INTEGER) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未入力の金額の欄があります" })
          if (value.amount === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "金額の欄には0以外を入力してください" })
        }
      }),
    to: z
      .array(
        z.object({
          id: z.string(),
          amount: z.number(),
        }),
      )
      .min(1, { message: "必須項目です" })
      .superRefine((values, ctx) => {
        for (const value of values) {
          if (value.id === "") ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未選択の人の欄があります" })
          if (value.amount === Number.MIN_SAFE_INTEGER) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "未入力の金額の欄があります" })
          if (value.amount === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "金額の欄には0以外を入力してください" })
        }
      }),
  })
  .refine(
    (values) => {
      const fromAmount = values.from.reduce((prev, current) => prev + current.amount, 0)
      const toAmount = values.to.reduce((prev, current) => prev + current.amount, 0)
      return fromAmount === toAmount
    },
    { message: "貸し借りの金額が一致しません", path: ["to"] },
  )

export default schema
