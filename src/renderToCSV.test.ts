"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { renderToCSV } from "./renderToCSV"
import { PullRequest } from "./PullRequest"

@suite
class RenderToCSVTests {
  private createPullRequest(url: string): PullRequest {
    return PullRequest.identity().withUrl(url)
  }

  @test
  "renders pull requests to csv"() {
    let input = [
      this.createPullRequest("https://example.com/pr/1"),
      this.createPullRequest("https://example.com/pr/2"),
      this.createPullRequest("https://example.com/pr/3")
    ]
    let result = renderToCSV(input)
    expect(result.length).to.be.greaterThan(0)
    expect(result.split("\n").length).to.equal(2)
  }
}
