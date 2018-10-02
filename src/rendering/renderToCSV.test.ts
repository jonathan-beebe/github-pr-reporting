"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { renderToCSV } from "./renderToCSV"
import { PullRequest } from "../models/PullRequest"

@suite
class RenderToCSVTests {
  @test
  "renders csv"() {
    const csv = this.renderSample()
    expect(csv.split("\n").length).to.equal(2)
  }

  @test
  "renders csv header"() {
    const csv = this.renderSample()
    const header = csv.split("\n")[0]
    expect(header).to.equal("Start, End, Count, Median, Min, Max, Min ID, Max ID")
  }

  @test
  "renders csv row"() {
    const csv = this.renderSample()
    const row = csv.split("\n")[1]
    // tslint:disable-next-line:max-line-length
    expect(row).to.equal("1969-12-28, 1970-01-03, 3, 0.00, 0.00, 0.00, https://example.com/pr/1, https://example.com/pr/1")
  }

  private renderSample(): string {
    const input = [
      this.createPullRequest("https://example.com/pr/1"),
      this.createPullRequest("https://example.com/pr/2"),
      this.createPullRequest("https://example.com/pr/3"),
    ]
    return renderToCSV(input)
  }

  private createPullRequest(url: string): PullRequest {
    return PullRequest.identity().withUrl(url)
  }
}
