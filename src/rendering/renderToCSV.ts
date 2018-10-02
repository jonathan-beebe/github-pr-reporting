"use strict"

import * as moment from "moment"
import { groupPullRequestByDate } from "../utils/groupPullRequestByDate"
import { PullRequest } from "../models/PullRequest"
import { start } from "repl"

function medianPullRequest(arr: PullRequest[], propertyGetter: ((item: PullRequest) => number)): PullRequest {
  arr = arr.sort((a, b) => propertyGetter(a) - propertyGetter(b))
  const i = arr.length / 2
  return arr[Math.floor(i)]
}

const MILLISECONDS_PER_HOUR = 3600000

interface PropertyStats<T> {
  min: T
  max: T
  median: T
}

interface PullRequestStats {
  start: string
  end: string
  count: number
  age: PropertyStats<PullRequest>
  activity: PropertyStats<PullRequest>
}

function gatherAgeStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  const min = arr.reduce((a, b) => (a.age < b.age ? a : b))
  const max = arr.reduce((a, b) => (a.age > b.age ? a : b))
  const median = medianPullRequest(arr, pr => pr.age)
  return {
    min,
    max,
    median,
  }
}

function gatherActivityStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  const min = arr.reduce((a, b) => (a.timeToFirstReviewerAction < b.timeToFirstReviewerAction ? a : b))
  const max = arr.reduce((a, b) => (a.timeToFirstReviewerAction > b.timeToFirstReviewerAction ? a : b))
  const median = medianPullRequest(arr, pr => pr.timeToFirstReviewerAction)
  return {
    min,
    max,
    median,
  }
}

function gatherStats(arr: PullRequest[]): PullRequestStats {
  const startDate = moment(arr[0].createdAt)
    .utc()
    .startOf("week")
    .format("YYYY-MM-DD")

  const endDate = moment(arr[0].createdAt)
    .utc()
    .endOf("week")
    .format("YYYY-MM-DD")

  return {
    start: startDate,
    end: endDate,
    count: arr.length,
    age: gatherAgeStats(arr),
    activity: gatherActivityStats(arr),
  }
}

function pullRequestsToCsvRow(prsArray) {
  const stats = gatherStats(prsArray)

  const startDate = stats.start
  const endDate = stats.end

  const medianAge = (stats.age.median.age / MILLISECONDS_PER_HOUR).toFixed(2)
  const minAge    = (stats.age.min.age    / MILLISECONDS_PER_HOUR).toFixed(2)
  const maxAge    = (stats.age.max.age    / MILLISECONDS_PER_HOUR).toFixed(2)

  const medianActivity = (stats.activity.median.timeToFirstReviewerAction / MILLISECONDS_PER_HOUR).toFixed(2)
  const minActivity    = (stats.activity.min.timeToFirstReviewerAction    / MILLISECONDS_PER_HOUR).toFixed(2)
  const maxActivity    = (stats.activity.max.timeToFirstReviewerAction    / MILLISECONDS_PER_HOUR).toFixed(2)

  // console.log("\n", endDate)
  // console.log("min activity", stats.activity.min.url)
  // console.log("med activity", stats.activity.median.url)
  // console.log("max activity", stats.activity.max.url)
  // console.log("\n")

  return [
    startDate,
    endDate,
    stats.count,
    minAge,
    medianAge,
    maxAge,
    minActivity,
    medianActivity,
    maxActivity,
    stats.age.min.url,
    stats.age.max.url,
  ]
}

const csvColumns = [
  "Start",
  "End",
  "Count",
  "Min Age",
  "Median Age",
  "Max Age",
  "Min Activity",
  "Median Activity",
  "Max Activity",
  "Min Age ID",
  "Max Age ID",
]

export const renderToCSV = (prs): string => {
  return []
    .concat([csvColumns.join(", ")])
    .concat(
      groupPullRequestByDate(prs)
        .map(pullRequestsToCsvRow)
        .map(row => row.join(", "))
    )
    .join("\n")
}
