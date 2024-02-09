import { z } from "zod"

const schema = z.object({
  lock: z.boolean(),
})

export default schema
