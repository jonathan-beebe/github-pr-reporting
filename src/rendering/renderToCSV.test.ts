"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { renderToCSV } from "./renderToCSV"
import { PullRequest } from "../models/PullRequest"

@suite
class RenderToCSVTests {
  @test
  "renders pull requests to csv"() {
    const input = [
      this.createPullRequest("https://example.com/pr/1"),
      this.createPullRequest("https://example.com/pr/2"),
      this.createPullRequest("https://example.com/pr/3"),
    ]
    const result = renderToCSV(input)
    expect(result.length).to.be.greaterThan(0)
    expect(result.split("\n").length).to.equal(2)
  }

  private createPullRequest(url: string): PullRequest {
    return PullRequest.identity().withUrl(url)
  }
}
