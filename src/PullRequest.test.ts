"use strict"

import { suite, test, slow, timeout } from "mocha-typescript"
import * as chai from "chai"
const assert = chai.assert
import { PullRequest } from "./PullRequest"

@suite
class PullRequestTest {
  @test
  "calculates age"() {
    let createdAt = new Date("2018-09-13 14:00:00")
    let closedAt = new Date("2018-09-13 16:00:00")
    let pr = new PullRequest("", createdAt, closedAt)
    assert.equal(pr.age, 120 * 60 * 1000)
  }
}
