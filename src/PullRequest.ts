"use strict"

type PullRequestProps = {
  url: string
  createdAt: Date
  closedAt: Date
  commentCount: number
  firstCommentDate?: Date | undefined
}

const pullRequestDefaults: PullRequestProps = {
  url: "",
  createdAt: new Date("1970-01-01Z00:00:00:000"),
  closedAt: new Date("1970-01-01Z00:00:00:000"),
  commentCount: 0,
  firstCommentDate: undefined
}

export class PullRequest {
  static identity(): PullRequest {
    return new PullRequest(pullRequestDefaults)
  }

  url: string
  createdAt: Date
  closedAt: Date
  commentCount: number
  firstCommentDate: Date | undefined

  constructor(props: PullRequestProps) {
    this.url = props.url
    this.createdAt = props.createdAt
    this.closedAt = props.closedAt
    this.commentCount = props.commentCount
    this.firstCommentDate = props.firstCommentDate
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
      commentCount: this.commentCount
    }
  }

  private with(key: string, value: any) {
    const props = Object.assign({}, this.toObject(), { [key]: value })
    return new PullRequest(props)
  }
}
