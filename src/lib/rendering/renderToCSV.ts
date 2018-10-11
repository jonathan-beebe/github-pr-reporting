"use strict"

import { groupPullRequestByDate } from "../utils/groupPullRequestByDate"
import { gatherStats } from "./gatherStats"

const MILLISECONDS_PER_HOUR = 3600000

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
