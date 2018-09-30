"use strict"

import { suite, test, slow, timeout } from "mocha-typescript"
import * as chai from "chai"
const assert = chai.assert
import { group } from "./group"

interface TestItem {
  name: string
  id: number
}

@suite
class GroupTests {
  @test
  group() {
    let items: TestItem[] = [
      { name: "a", id: 1 },
      { name: "b", id: 2 },
      { name: "c", id: 3 },
      { name: "d", id: 4 },
      { name: "e", id: 5 }
    ]
    let grouped = group(
      items,
      <TestItem>(a): string => {
        return `${a.id}`
      }
    )
    assert.equal(grouped.length, 5)
  }
}
