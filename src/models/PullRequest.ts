"use strict"

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
  participantCount: number
  reactionCount: number
  timelineCount: number
}

const pullRequestDefaults: PullRequestProps = {
  url: "",
  createdAt: new Date("1970-01-01Z00:00:00:000"),
  closedAt: new Date("1970-01-01Z00:00:00:000"),
  changedFilesCount: 0,
  additionsCount: 0,
  deletionsCount: 0,
  commentCount: 0,
  firstCommentDate: undefined,
  reviewCount: 0,
  participantCount: 0,
  reactionCount: 0,
  timelineCount: 0
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
    this.participantCount = props.participantCount
    this.reactionCount = props.reactionCount
    this.timelineCount = props.timelineCount
  }

  get age(): number {
    return this.closedAt.getTime() - this.createdAt.getTime()
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

  toObject(): PullRequestProps {
    return {
      url: this.url,
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      changedFilesCount: this.changedFilesCount,
      additionsCount: this.additionsCount,
      deletionsCount: this.deletionsCount,
      commentCount: this.commentCount,
      reviewCount: this.reviewCount,
      participantCount: this.participantCount,
      reactionCount: this.reactionCount,
      timelineCount: this.timelineCount
    }
  }

  private with(key: string, value: any) {
    const props = Object.assign({}, this.toObject(), { [key]: value })
    return new PullRequest(props)
  }
}
