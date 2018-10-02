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
  const url = obj.url
  const createdAt = new Date(obj.createdAt)
  const closedAt = new Date(obj.closedAt)
  const firstCommentDate = obj.comments.nodes.map(commentJson => {
    return new Date(commentJson.createdAt)
  })[0]
  const firstReviewDate = obj.reviews.nodes.map(reviewJson => {
    return new Date(reviewJson.createdAt)
  })[0]

  return new PullRequest({
    url,
    createdAt,
    closedAt,
    changedFilesCount: obj.changedFiles,
    additionsCount: obj.additions,
    deletionsCount: obj.deletions,
    commentCount: obj.comments.totalCount,
    firstCommentDate,
    reviewCount: obj.reviews.totalCount,
    firstReviewDate,
    participantCount: obj.participants.totalCount,
    reactionCount: obj.reactions.totalCount,
    timelineCount: obj.timeline.totalCount,
  })
}
