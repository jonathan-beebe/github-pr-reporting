"use strict"

export class QueryBuilder {
  private owner: string
  private repo: string
  private beforeCursor?: string

  withOwner(owner: string): QueryBuilder {
    this.owner = owner
    return this
  }

  withRepoName(name: string): QueryBuilder {
    this.repo = name
    return this
  }

  withBeforeCursor(cursor?: string): QueryBuilder {
    this.beforeCursor = cursor
    return this
  }

  build(): string {
    let beforeCursorString = this.beforeCursor ? `before: \\\"${this.beforeCursor}\\\",` : ""
    return `{
      repository(owner: \\\"${this.owner}\\\", name: \\\"${this.repo}\\\") {
        pullRequests(last: 100, ${beforeCursorString} states: [CLOSED,MERGED]) {
          edges {
            node {
              url
              createdAt
              closedAt
            }
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }`.replace(/(?:\r\n|\r|\n)/g, "")
  }
}
