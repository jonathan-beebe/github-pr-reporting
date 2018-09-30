"use strict"

import { suite, test, slow, timeout } from "mocha-typescript"
import * as chai from "chai"
const assert = chai.assert
const expect = chai.expect
// tslint:disable-next-line:no-var-requires
chai.use(require("chai-datetime"))
import * as dateUtils from "./dateUtils"

@suite
class DateUtilsTests {
  @test
  "returns date range for date"() {
    const date = new Date("2018-09-14T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-16T23:23:59.999Z"))
  }

  @test
  "returns date range for start of week"() {
    const date = new Date("2018-09-10T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-16T23:23:59.999Z"))
  }

  @test
  "returns date range for end of week"() {
    const date = new Date("2018-09-16T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-16T23:23:59.999Z"))
  }

  @test
  "returns date range for last week"() {
    const date = new Date("2018-09-08T23:59:59.999Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-03T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-09T23:23:59.999Z"))
  }

  @test
  "returns date range for next week"() {
    const date = new Date("2018-09-17T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-17T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-23T23:23:59.999Z"))
  }

  @test
  regression() {
    const date = new Date("2018-09-09 14:00:00")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalDate(new Date("2018-09-03T00:00:00.000Z"))
    expect(range.end).to.equalDate(new Date("2018-09-09T23:23:59.999Z"))
  }
}
