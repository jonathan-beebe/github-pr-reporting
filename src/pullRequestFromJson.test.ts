"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { readMock } from "./__mocks__/readMock"
import { valueAtKeyPath } from "./utils"
import { toPullRequest } from "./pullRequestFromJson"

const successResponseJsonObj = JSON.parse(readMock("sample_result"))
let firstPullRequestJson = valueAtKeyPath(successResponseJsonObj, "data.repository.pullRequests.edges")[0]["node"]

@suite
class PullRequestFromJsonTests {
  @test
  "parses pull request json"() {
    let parsed = toPullRequest(firstPullRequestJson)
    expect(parsed).to.not.be.null
  }
}
