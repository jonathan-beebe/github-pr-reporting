"use strict"

import * as fs from "fs"

export const readMock = (name: string): string => {
  return fs.readFileSync(`${__dirname}/${name}.json`).toString()
}
