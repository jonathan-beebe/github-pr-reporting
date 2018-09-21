"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { renderToCSV } from "./renderToCSV"
import { PullRequest } from "./PullRequest"

@suite
class RenderToCSVTests {
  @test
  "renders pull requests to csv"() {
    let input = [
      new PullRequest("https://example.com/pr/1", new Date(), new Date()),
      new PullRequest("https://example.com/pr/2", new Date(), new Date()),
      new PullRequest("https://example.com/pr/3", new Date(), new Date())
    ]
    let result = renderToCSV(input)
    expect(result.length).to.be.greaterThan(0)
    expect(result.split("\n").length).to.equal(2)
  }
}
