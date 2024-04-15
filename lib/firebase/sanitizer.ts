const isIdValid = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(id)
}

export { isIdValid }
