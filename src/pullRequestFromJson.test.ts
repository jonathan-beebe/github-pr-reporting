"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { toPullRequest } from "./pullRequestFromJson"

@suite
class PullRequestFromJsonTests {
  @test.skip
  "parses pull request json"() {}
}
