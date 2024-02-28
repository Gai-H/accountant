type ServerActionResponse<T> =
  | {
      ok: false
      message: string
    }
  | {
      ok: true
      data: T
    }

export { ServerActionResponse }
