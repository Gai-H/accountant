import { z } from "zod"

const schema = z.object({
  id: z.string(),
  symbol: z.string().min(1, { message: "必須項目です" }).max(3, { message: "最大3文字です" }),
  oneInJPY: z.number().gt(0, { message: "0より大きい数値を入力してください" }),
})

export { schema }
