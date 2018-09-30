"use strict"

import * as moment from "moment"
import { groupPullRequestByDate } from "../utils/groupPullRequestByDate"

function median(arr) {
  arr = arr.sort((a, b) => a - b)
  var i = arr.length / 2
  return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)]
}

const MILLISECONDS_PER_HOUR = 3600000

export const renderToCSV = (prs): string => {
  var buffer: string[] = []
  let week = 0
  buffer.push("Start, End, Count, Median, Min, Max, Min ID, Max ID")
  groupPullRequestByDate(prs).forEach(prs => {
    let ages = prs.map(x => x.age).map(x => x / MILLISECONDS_PER_HOUR)
    let startDate = moment(prs[0].createdAt)
      .utc()
      .startOf("week")
      .format("YYYY-MM-DD")
    let endDate = moment(prs[0].createdAt)
      .utc()
      .endOf("week")
      .format("YYYY-MM-DD")
    let min = prs.reduce((a, b) => (a.age < b.age ? a : b))
    let max = prs.reduce((a, b) => (a.age > b.age ? a : b))
    let minAge = (min.age / MILLISECONDS_PER_HOUR).toFixed(2)
    let maxAge = (max.age / MILLISECONDS_PER_HOUR).toFixed(2)
    buffer.push(
      `${startDate}, ${endDate}, ${prs.length}, ${median(ages).toFixed(2)}, ${minAge}, ${maxAge}, ${min.url}, ${
        max.url
      }`
    )
    week -= 1
  })
  return buffer.join("\n")
}
