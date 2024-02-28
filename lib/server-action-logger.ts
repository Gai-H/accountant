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

    log.info(`Server Action Request ${actionId} by ${session.user.displayName} (${session.user.id})`, ...args)
    const res = await action(...args)
    log.info(`Server Action Response ${actionId}`, res as { [key: string]: any } | undefined)
    await log.flush()

    return res
  }
}

export { logger }
