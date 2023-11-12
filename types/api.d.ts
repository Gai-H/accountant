export type Response<T, S = undefined> =
  | (S extends undefined
      ? {
          message: "error"
        }
      : {
          message: "error"
          error: S
        })
  | {
      message: "ok"
      data: T
    }
