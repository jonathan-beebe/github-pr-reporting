"use strict"

import { suite, test, slow, timeout } from "mocha-typescript"
import * as chai from "chai"
const assert = chai.assert
const expect = chai.expect
import { PullRequest } from "../models/PullRequest"
import { groupPullRequestByDate } from "./groupPullRequestByDate"

@suite
class GroupPullRequestByDateTests {
  private createPullRequest(createdAt: string, closedAt: string): PullRequest {
    return PullRequest.identity()
      .withCreatedAt(new Date(createdAt))
      .withClosedAt(new Date(closedAt))
  }

  @test
  "groups when all within range"() {
    let input = [
      this.createPullRequest("2018-09-13 14:00:00", "2018-09-13 16:00:00"),
      this.createPullRequest("2018-09-14 14:00:00", "2018-09-14 16:00:00"),
      this.createPullRequest("2018-09-15 14:00:00", "2018-09-15 16:00:00")
    ]
    let grouped = groupPullRequestByDate(input)
    assert.equal(grouped.length, 1)
    assert.equal(grouped[0].length, 3)
  }

  @test
  "groups different weeks into new buckets"() {
    let input = [
      this.createPullRequest("2018-09-01 14:00:00", "2018-09-01 16:00:00"),
      this.createPullRequest("2018-09-09 14:00:00", "2018-09-09 16:00:00"),
      this.createPullRequest("2018-09-10 14:00:00", "2018-09-10 16:00:00")
    ]
    let grouped = groupPullRequestByDate(input)
    assert.equal(grouped.length, 3)
    assert.equal(grouped[0].length, 1)
    assert.equal(grouped[1].length, 1)
    assert.equal(grouped[2].length, 1)
  }

  @test
  "sorts oldest to newest"() {
    let input = [
      this.createPullRequest("2019-01-09 14:00:00", "2019-01-09 16:00:00"),
      this.createPullRequest("2018-12-01 14:00:00", "2018-12-01 16:00:00"),
      this.createPullRequest("2017-12-01 14:00:00", "2017-12-01 16:00:00")
    ]
    let grouped = groupPullRequestByDate(input)
    assert.equal(grouped[0][0].createdAt.getFullYear(), 2017)
    assert.equal(grouped[1][0].createdAt.getFullYear(), 2018)
    assert.equal(grouped[2][0].createdAt.getFullYear(), 2019)
  }
}
