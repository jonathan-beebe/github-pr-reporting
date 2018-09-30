"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { valueAtKeyPath } from "./utils"

@suite
class KeyPathTests {
  target = {
    a: {
      b: {
        c: "value"
      }
    },
    x: {
      y: {
        z: "other"
      }
    }
  }

  @test
  "returns value at key path"() {
    expect(valueAtKeyPath(this.target, "a.b.c")).to.equal("value")
  }

  @test
  "returns null when root value does not exist"() {
    expect(valueAtKeyPath(this.target, "d")).to.be.undefined
  }

  @test
  "returns null when key path does not exist"() {
    expect(valueAtKeyPath(this.target, "d.e.f")).to.be.undefined
  }
}
