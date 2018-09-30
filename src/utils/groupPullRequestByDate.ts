"use strict"

import { PullRequest } from "../models/PullRequest"
import * as dateUtils from "./dateUtils"
import { group } from "./group"
import * as moment from "moment"

const sort = (lhs: PullRequest, rhs: PullRequest): number => {
  const a = moment(lhs.createdAt)
  const b = moment(rhs.createdAt)
  return a.isBefore(b) ? -1 : 1
}

export const groupPullRequestByDate = (input: PullRequest[]): PullRequest[][] => {
  const grouped = group(
    input.sort(sort),
    // tslint:disable-next-line:no-shadowed-variable
    <PullRequest>(a): string => {
      return dateUtils.getFirstDateOfWeekForDate(a.createdAt).toDateString()
    }
  )
  return grouped.sort(
    (lhs, rhs): number => {
      const a = lhs[0]
      const b = rhs[0]
      return sort(a, b)
    }
  )
}
