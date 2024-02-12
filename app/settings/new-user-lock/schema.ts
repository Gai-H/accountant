import { z } from "zod"

const schema = z.object({
  "new-user-lock": z.boolean(),
})

export { schema }
