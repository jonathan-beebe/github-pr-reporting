"use strict"

import { suite, test, slow, timeout } from "mocha-typescript"
import * as chai from "chai"
const assert = chai.assert
const expect = chai.expect
import { PullRequest } from "./PullRequest"

@suite
class PullRequestTest {
  @test
  "first comment date is undefined by default"() {
    expect(PullRequest.identity().firstCommentDate).to.be.undefined
  }

  @test
  "calculates age"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const closedAt = new Date("2018-09-13 16:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withClosedAt(closedAt)
    assert.equal(pr.age, 120 * 60 * 1000)
  }
}
