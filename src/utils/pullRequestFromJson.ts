"use strict"

import { PullRequest } from "../models/PullRequest"

export interface PullRequestCountableJson {
  totalCount: number
}

export interface PullRequestCreatedAtJson {
  createdAt: string
}

export interface PullRequestCreatedCollectionJson extends PullRequestCountableJson {
  nodes: PullRequestCreatedAtJson[]
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
  comments: PullRequestCreatedCollectionJson
  reviews: PullRequestCreatedCollectionJson
  participants: PullRequestCountableJson
  reactions: PullRequestCountableJson
  timeline: PullRequestCountableJson
}

export const toPullRequest = (obj: PullRequestJson): PullRequest => {
  let url = obj.url
  let createdAt = new Date(obj.createdAt)
  let closedAt = new Date(obj.closedAt)
  let firstCommentDate = obj.comments.nodes.map(commentJson => {
    return new Date(commentJson.createdAt)
  })[0]

  return new PullRequest({
    url: url,
    createdAt: createdAt,
    closedAt: closedAt,
    commentCount: obj.comments.totalCount,
    firstCommentDate: firstCommentDate,
    reviewCount: obj.reviews.totalCount,
    participantCount: obj.participants.totalCount,
    reactionCount: obj.reactions.totalCount,
    timelineCount: obj.timeline.totalCount
  })
}
