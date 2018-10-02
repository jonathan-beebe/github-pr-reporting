"use strict"

import * as moment from "moment"
import { groupPullRequestByDate } from "../utils/groupPullRequestByDate"
import { PullRequest } from "../models/PullRequest"

function median(arr) {
  arr = arr.sort((a, b) => a - b)
  const i = arr.length / 2
  return i % 1 === 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)]
}

const MILLISECONDS_PER_HOUR = 3600000

interface PropertyStats<T> {
  min: T
  max: T
  median: T
}

interface PullRequestStats {
  start: Date
  end: Date
  count: number
  min: PropertyStats<PullRequest>
  max: PropertyStats<PullRequest>
  median: PropertyStats<PullRequest>
}

// function gatherStats(arr: PullRequest[], propertyGetter: ((item: PullRequest) => number)): PullRequestStats {
//   return {
//     min: values.reduce((a, b) => (a < b ? a : b)),
//     max: values.reduce((a, b) => (a > b ? a : b)),
//     median: median(values),
//   }
// }

export const renderToCSV = (prs): string => {
  const buffer: string[] = []
  let week = 0
  buffer.push("Start, End, Count, Median, Min, Max, Min ID, Max ID")
  groupPullRequestByDate(prs).forEach(prsArray => {
    const ages = prsArray.map(x => x.age).map(x => x / MILLISECONDS_PER_HOUR)
    const startDate = moment(prsArray[0].createdAt)
      .utc()
      .startOf("week")
      .format("YYYY-MM-DD")
    const endDate = moment(prsArray[0].createdAt)
      .utc()
      .endOf("week")
      .format("YYYY-MM-DD")
    const min = prsArray.reduce((a, b) => (a.age < b.age ? a : b))
    const max = prsArray.reduce((a, b) => (a.age > b.age ? a : b))
    const minAge = (min.age / MILLISECONDS_PER_HOUR).toFixed(2)
    const maxAge = (max.age / MILLISECONDS_PER_HOUR).toFixed(2)
    buffer.push(
      // tslint:disable-next-line:max-line-length
      `${startDate}, ${endDate}, ${prsArray.length}, ${median(ages).toFixed(2)}, ${minAge}, ${maxAge}, ${min.url}, ${max.url}`
    )
    week -= 1
  })
  return buffer.join("\n")
}
