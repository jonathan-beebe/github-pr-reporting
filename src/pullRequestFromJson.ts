"use strict"

import { PullRequest } from "./PullRequest"

export interface PullRequestCommentJson {
  createdAt: string
}

export interface PullRequestCommentsJson {
  totalCount: number
  nodes: PullRequestCommentJson[]
}

// An interface to describe the shape of a pull request expected from the api.
export interface PullRequestJson {
  url: string
  number: string
  title: string
  createdAt: string
  closedAt: string
  changedFiles: number
  additions: number
  deletions: number
  comments: PullRequestCommentsJson
}

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
