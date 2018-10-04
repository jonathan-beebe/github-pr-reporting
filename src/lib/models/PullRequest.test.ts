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
  "calculates age within same day"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const closedAt = new Date("2018-09-13 16:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withClosedAt(closedAt)
    assert.equal(pr.age, 120 * 60 * 1000)
  }

  @test
  "calculates age across multiple days"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const closedAt = new Date("2018-09-15 16:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withClosedAt(closedAt)
    assert.equal(pr.age, 50 * 60 * 60 * 1000)
  }

  @test
  "defaults time to first reviewer action to undefined"() {
    expect(PullRequest.identity().timeToFirstReviewerAction).to.be.undefined
  }

  @test
  "calculates time to first reviewer action"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const reviewedAt = new Date("2018-09-15 16:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withReviewedAt(reviewedAt)
    assert.equal(pr.timeToFirstReviewerAction, 50 * 60 * 60 * 1000)
  }

  @test
  "calculates time to first comment action"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const commentAt = new Date("2018-09-15 16:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withCommentAt(commentAt)
    assert.equal(pr.timeToFirstReviewerAction, 50 * 60 * 60 * 1000)
  }

  @test
  "favors earliest time to first reviewer action"() {
    const createdAt = new Date("2018-09-13 14:00:00")
    const reviewedAt = new Date("2018-09-15 16:00:00")
    const commentAt = new Date("2018-09-15 17:00:00")
    const pr = PullRequest.identity()
      .withCreatedAt(createdAt)
      .withReviewedAt(reviewedAt)
      .withCommentAt(commentAt)
    assert.equal(pr.timeToFirstReviewerAction, 50 * 60 * 60 * 1000)
  }

  @test
  "change size defaults to zero"() {
    expect(PullRequest.identity().changeSize).equals(0)
  }

  @test
  "calculates change size"() {
    const pr = PullRequest.identity()
      .withAdditions(20)
      .withDeletions(20)
    expect(pr.changeSize).to.equal(40)
  }
}
