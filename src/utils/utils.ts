export const valueAtKeyPath = (target: { [key: string]: any }, keyPath: string): any | undefined => {
  return keyPath.split(".").reduce((previous, current) => {
    if (previous === undefined) {
      return previous
    }
    return previous[current]
  }, target)
}
