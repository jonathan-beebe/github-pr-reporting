"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { readMock } from "../__mocks__/readMock"
import { valueAtKeyPath } from "./utils"
import { toPullRequest } from "./pullRequestFromJson"

const successResponseJsonObj = JSON.parse(readMock("sample_result"))
const firstPullRequestJson = valueAtKeyPath(successResponseJsonObj, "data.repository.pullRequests.edges")[0]["node"]
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
}
