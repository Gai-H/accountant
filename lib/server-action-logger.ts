import { Logger } from "next-axiom"
import { auth } from "@/lib/next-auth/auth"
import { ServerActionResponse } from "@/types/server-action"

type ServerAction<T extends any[] = any[], R = any> = (...args: T) => Promise<ServerActionResponse<R>>

const logger = <T extends any[], R>(action: ServerAction<T, R>): ServerAction<T, R> => {
  return async (...args) => {
    const log = new Logger()
    const session = await auth()

    if (!session) {
      return {
        ok: false,
        message: "Not signed in",
      }
    }

    const actionId = crypto.randomUUID()

    const argString = args.map((arg) => JSON.stringify(arg)).join(", ")
    log.info(`Server Action Request ${actionId} by ${session.user.displayName} (${session.user.id}) ${argString}`)

    const res = await action(...args)

    log.info(`Server Action Response ${actionId} ${JSON.stringify(res)}`)
    await log.flush()

    return res
  }
}

export { logger }
