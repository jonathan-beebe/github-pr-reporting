"use strict"

import { suite, test } from "mocha-typescript"
import * as chai from "chai"
const expect = chai.expect
import { renderToCSV } from "./renderToCSV"
import { PullRequest } from "../models/PullRequest"
import { join } from "path"

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
    // tslint:disable-next-line:max-line-length
    expect(header).to.equal("Start, End, Count, Min Age, Median Age, Max Age, Min Activity, Median Activity, Max Activity, Min File Count, Median File Count, Max File Count, Min Age ID, Max Age ID")
  }

  @test
  "renders csv row"() {
    const csv = this.renderSample()
    const row = csv.split("\n")[1]
    // tslint:disable-next-line:max-line-length
    expect(row).to.equal("2018-09-09, 2018-09-15, 3, 2.00, 4.00, 6.00, 1.00, 2.00, 3.00, 1, 5, 10, https://example.com/pr/1, https://example.com/pr/3")
  }

  private renderSample(): string {
    const input = [
      PullRequest.identity()
        .withCreatedAt(new Date("2018-09-13 00:00:00"))
        .withClosedAt(new Date("2018-09-13 02:00:00"))
        .withReviewedAt(new Date("2018-09-13 01:00:00"))
        .withChangedFileCount(1)
        .withUrl("https://example.com/pr/1"),
      PullRequest.identity()
        .withCreatedAt(new Date("2018-09-14 00:00:00"))
        .withClosedAt(new Date("2018-09-14 04:00:00"))
        .withReviewedAt(new Date("2018-09-14 02:00:00"))
        .withChangedFileCount(5)
        .withUrl("https://example.com/pr/2"),
      PullRequest.identity()
        .withCreatedAt(new Date("2018-09-15 00:00:00"))
        .withClosedAt(new Date("2018-09-15 06:00:00"))
        .withReviewedAt(new Date("2018-09-15 03:00:00"))
        .withChangedFileCount(10)
        .withUrl("https://example.com/pr/3"),
    ]
    return renderToCSV(input)
  }

  private createPullRequest(url: string): PullRequest {
    return PullRequest.identity().withUrl(url)
  }
}
