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
const DATE_FORMAT = "YYYY-MM-DD"
const WEEK = "week"

interface PropertyStats<T> {
  min: T
  max: T
  median: T
}

export interface PullRequestStats {
  start: string
  end: string
  count: number
  age: PropertyStats<PullRequest>
  activity: PropertyStats<PullRequest>
  changedFiles: PropertyStats<PullRequest>
  changeSize: PropertyStats<PullRequest>
}

function gatherStatsForProperty(arr: PullRequest[], propertyName: string): PropertyStats<PullRequest> {
  const min = arr.reduce((a, b) => (a[propertyName] < b[propertyName] ? a : b))
  const max = arr.reduce((a, b) => (a[propertyName] > b[propertyName] ? a : b))
  const median = medianPullRequest(arr, pr => pr[propertyName])
  return {
    min,
    max,
    median,
  }
}

function gatherAgeStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  return gatherStatsForProperty(arr, "age")
}

function gatherActivityStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  return gatherStatsForProperty(arr, "timeToFirstReviewerAction")
}

function gatherChangedFilesStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  return gatherStatsForProperty(arr, "changedFilesCount")
}

function gatherChangeSizeStats(arr: PullRequest[]): PropertyStats<PullRequest> {
  return gatherStatsForProperty(arr, "changeSize")
}

export const gatherStats = (arr: PullRequest[]): PullRequestStats => {
  const startDate = moment(arr[0].createdAt)
    .utc()
    .startOf(WEEK)
    .format(DATE_FORMAT)

  const endDate = moment(arr[0].createdAt)
    .utc()
    .endOf(WEEK)
    .format(DATE_FORMAT)

  return {
    start: startDate,
    end: endDate,
    count: arr.length,
    age: gatherAgeStats(arr),
    activity: gatherActivityStats(arr),
    changedFiles: gatherChangedFilesStats(arr),
    changeSize: gatherChangeSizeStats(arr),
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

  const medianFileCount = stats.changedFiles.median.changedFilesCount
  const minFileCount    = stats.changedFiles.min.changedFilesCount
  const maxFileCount    = stats.changedFiles.max.changedFilesCount

  const medianChangeSize = stats.changeSize.median.changeSize
  const minChangeSize    = stats.changeSize.min.changeSize
  const maxChangeSize    = stats.changeSize.max.changeSize

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
    minFileCount,
    medianFileCount,
    maxFileCount,
    minChangeSize,
    medianChangeSize,
    maxChangeSize,
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
  "Min File Count",
  "Median File Count",
  "Max File Count",
  "Min Change Size",
  "Median Change Size",
  "Max Change Size",
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
