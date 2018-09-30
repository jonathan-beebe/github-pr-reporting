"use strict"

type GroupingCallback = <T>(t: T) => string

export const group = <T>(items: T[], callback: GroupingCallback): T[][] => {
  let grouped = items.reduce((result, x) => {
    let key: string = callback(x)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(x)
    return result
  }, {})
  return Object.keys(grouped).map(key => grouped[key])
}
