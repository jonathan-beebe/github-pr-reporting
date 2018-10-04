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
    expect(range.start).to.equalTime(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-16T23:59:59.999Z"))
  }

  @test
  "returns date range for start of week"() {
    const date = new Date("2018-09-10T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalTime(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-16T23:59:59.999Z"))
  }

  @test
  "returns date range for end of week"() {
    const date = new Date("2018-09-16T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalTime(new Date("2018-09-10T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-16T23:59:59.999Z"))
  }

  @test
  "returns date range for last week"() {
    const date = new Date("2018-09-08T23:59:59.999Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalTime(new Date("2018-09-03T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-09T23:59:59.999Z"))
  }

  @test
  "returns date range for next week"() {
    const date = new Date("2018-09-17T00:00:00.000Z")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalTime(new Date("2018-09-17T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-23T23:59:59.999Z"))
  }

  @test
  regression() {
    const date = new Date("2018-09-09 14:00:00")
    const range: dateUtils.WeekRange = dateUtils.weekRangeFor(date)
    expect(range.start).to.equalTime(new Date("2018-09-03T00:00:00.000Z"))
    expect(range.end).to.equalTime(new Date("2018-09-09T23:59:59.999Z"))
  }

  @test
  "returns undefined if dates array does not contain dates"() {
    const found = dateUtils.earliestDateIn([undefined, undefined])
    expect(found).to.be.undefined
  }

  @test
  "finds earliest date in array"() {
    const a = new Date("2018-09-17T00:00:00.000Z")
    const b = new Date("2018-09-18T00:00:00.000Z")
    const c = new Date("2018-09-19T00:00:00.000Z")
    const found = dateUtils.earliestDateIn([b, a, c])
    expect(found).to.equal(a)
  }
}
