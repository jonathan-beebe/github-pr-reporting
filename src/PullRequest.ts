export class PullRequest {
  url: string
  createdAt: Date
  closedAt: Date

  constructor(url: string, createdAt: Date, closedAt: Date) {
    this.url = url
    this.createdAt = createdAt
    this.closedAt = closedAt
  }

  get age(): number {
    return this.closedAt.getTime() - this.createdAt.getTime()
  }
}
