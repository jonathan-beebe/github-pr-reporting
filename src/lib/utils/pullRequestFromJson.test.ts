"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
// tslint:disable-next-line:no-var-requires
chai.use(require("chai-datetime"))
import { readMock } from "../__mocks__/readMock"
import { valueAtKeyPath } from "./utils"
import { toPullRequest } from "./pullRequestFromJson"

const successResponseJsonObj = JSON.parse(readMock("sample_result"))
const firstPullRequestJson = valueAtKeyPath(
  successResponseJsonObj,
  "data.repository.pullRequests.edges"
)[0].node
const parsed = toPullRequest(firstPullRequestJson)

@suite
class PullRequestFromJsonTests {
  @test
  "parsed pull request json"() {
    expect(parsed).to.not.be.null
  }

  @test
  "calculates total comment count"() {
    expect(parsed.commentCount).to.equal(5)
  }

  @test
  "has first comment count"() {
    expect(parsed.firstCommentDate).to.not.be.undefined
  }

  @test
  "has review count"() {
    expect(parsed.reviewCount).to.equal(1)
  }

  @test
  "has participant count"() {
    expect(parsed.participantCount).to.equal(3)
  }

  @test
  "has reaction count"() {
    expect(parsed.reactionCount).to.equal(12)
  }

  @test
  "has timeline count"() {
    expect(parsed.timelineCount).to.equal(9)
  }

  @test
  "has changed files count"() {
    expect(parsed.changedFilesCount).to.equal(184)
  }

  @test
  "has additions count"() {
    expect(parsed.additionsCount).to.equal(24132)
  }

  @test
  "has deletions count"() {
    expect(parsed.deletionsCount).to.equal(11)
  }

  @test
  "has first comment date"() {
    expect(parsed.firstCommentDate).to.equalTime(new Date("2018-04-24T20:40:59Z"))
  }

  @test
  "has first review date"() {
    expect(parsed.firstReviewDate).to.equalTime(new Date("2018-04-24T20:41:35Z"))
  }
}
