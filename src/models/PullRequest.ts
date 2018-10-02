"use strict"

import * as dateUtils from "../utils/dateUtils"

const REFERENCE_DATE = "1970-01-01Z00:00:00:000"

type PullRequestProps = {
  url: string
  createdAt: Date
  closedAt: Date
  changedFilesCount: number
  additionsCount: number
  deletionsCount: number
  commentCount: number
  firstCommentDate?: Date | undefined
  reviewCount: number
  firstReviewDate?: Date | undefined
  participantCount: number
  reactionCount: number
  timelineCount: number
}

const pullRequestDefaults: PullRequestProps = {
  url: "",
  createdAt: new Date(REFERENCE_DATE),
  closedAt: new Date(REFERENCE_DATE),
  changedFilesCount: 0,
  additionsCount: 0,
  deletionsCount: 0,
  commentCount: 0,
  firstCommentDate: undefined,
  reviewCount: 0,
  firstReviewDate: undefined,
  participantCount: 0,
  reactionCount: 0,
  timelineCount: 0,
}

export class PullRequest {
  static identity(): PullRequest {
    return new PullRequest(pullRequestDefaults)
  }

  url: string
  createdAt: Date
  closedAt: Date
  changedFilesCount: number
  additionsCount: number
  deletionsCount: number
  commentCount: number
  firstCommentDate: Date | undefined
  reviewCount: number
  firstReviewDate: Date | undefined
  participantCount: number
  reactionCount: number
  timelineCount: number

  constructor(props: PullRequestProps) {
    this.url = props.url
    this.createdAt = props.createdAt
    this.closedAt = props.closedAt
    this.changedFilesCount = props.changedFilesCount
    this.additionsCount = props.additionsCount
    this.deletionsCount = props.deletionsCount
    this.commentCount = props.commentCount
    this.firstCommentDate = props.firstCommentDate
    this.reviewCount = props.reviewCount
    this.firstReviewDate = props.firstReviewDate
    this.participantCount = props.participantCount
    this.reactionCount = props.reactionCount
    this.timelineCount = props.timelineCount
  }

  get age(): number {
    return this.closedAt.getTime() - this.createdAt.getTime()
  }

  get changeSize(): number {
    return this.additionsCount + this.deletionsCount
  }

  get timeToFirstReviewerAction(): number | undefined {
    const start = this.createdAt
    const end = dateUtils.earliestDateIn([this.firstCommentDate, this.firstReviewDate])
    if (start && end) {
      return end.getTime() - start.getTime()
    }
    return undefined
  }

  withUrl(url: string): PullRequest {
    return this.with("url", url)
  }

  withCreatedAt(date: Date): PullRequest {
    return this.with("createdAt", date)
  }

  withClosedAt(date: Date): PullRequest {
    return this.with("closedAt", date)
  }

  withAdditions(num: number): PullRequest {
    return this.with("additionsCount", num)
  }

  withDeletions(num: number): PullRequest {
    return this.with("deletionsCount", num)
  }

  withReviewedAt(date: Date): PullRequest {
    return this.with("firstReviewDate", date)
  }

  withCommentAt(date: Date): PullRequest {
    return this.with("firstCommentDate", date)
  }

  toObject(): PullRequestProps {
    return {
      url: this.url,
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      changedFilesCount: this.changedFilesCount,
      additionsCount: this.additionsCount,
      deletionsCount: this.deletionsCount,
      commentCount: this.commentCount,
      firstCommentDate: this.firstCommentDate,
      reviewCount: this.reviewCount,
      firstReviewDate: this.firstReviewDate,
      participantCount: this.participantCount,
      reactionCount: this.reactionCount,
      timelineCount: this.timelineCount,
    }
  }

  private with(key: string, value: any) {
    const props = Object.assign({}, this.toObject(), { [key]: value })
    return new PullRequest(props)
  }
}
