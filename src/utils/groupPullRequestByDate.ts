"use strict"

import { PullRequest } from "../models/PullRequest"
import * as dateUtils from "./dateUtils"
import { group } from "./group"
import * as moment from "moment"

const sort = (lhs: PullRequest, rhs: PullRequest): number => {
  let a = moment(lhs.createdAt)
  let b = moment(rhs.createdAt)
  return a.isBefore(b) ? -1 : 1
}

export const groupPullRequestByDate = function(input: PullRequest[]): PullRequest[][] {
  let grouped = group(
    input.sort(sort),
    <PullRequest>(a): string => {
      return dateUtils.getFirstDateOfWeekForDate(a.createdAt).toDateString()
    }
  )
  return grouped.sort(
    (lhs, rhs): number => {
      let a = lhs[0]
      let b = rhs[0]
      return sort(a, b)
    }
  )
}
