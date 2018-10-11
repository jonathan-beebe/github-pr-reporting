"use strict"

import * as moment from "moment"
import { groupPullRequestByDate } from "../utils/groupPullRequestByDate"
import { PullRequest } from "../models/PullRequest"

function medianPullRequest(arr: PullRequest[], propertyGetter: ((item: PullRequest) => number)): PullRequest {
  arr = arr.sort((a, b) => propertyGetter(a) - propertyGetter(b))
  const i = arr.length / 2
  return arr[Math.floor(i)]
}

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
