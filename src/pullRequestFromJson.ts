"use strict"

import { PullRequest } from "./PullRequest"
import { PullRequestJson } from "./Api"

export const toPullRequest = (obj: PullRequestJson): PullRequest => {
  let url = obj.url
  let createdAt = new Date(obj.createdAt)
  let closedAt = new Date(obj.closedAt)
  console.log("comments", obj.comments)
  let commentCount = obj.comments.totalCount
  let firstCommentDate = obj.comments.nodes.map(commentJson => {
    return new Date(commentJson.createdAt)
  })[0]
  console.log("commentCount", commentCount)
  console.log("first comment date", firstCommentDate)
  return new PullRequest(url, createdAt, closedAt)
}