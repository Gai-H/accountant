export type Response<T> =
  | {
      message: "error"
    }
  | {
      message: "ok"
      data: T
    }
