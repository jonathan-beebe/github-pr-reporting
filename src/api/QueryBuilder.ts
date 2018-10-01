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
    const beforeCursorString = this.beforeCursor ? `before: \\\"${this.beforeCursor}\\\",` : ""
    return `{
      repository(owner: \\\"${this.owner}\\\", name: \\\"${this.repo}\\\") {
        pullRequests(last: 50, ${beforeCursorString} states: [CLOSED,MERGED]) {
          edges {
            node {
              url
              permalink
              number
              title
              createdAt
              closedAt
              changedFiles
              additions
              deletions
              comments(first: 1) {
                totalCount
                nodes {
                  createdAt
                }
              }
              reviews(first: 1) {
                totalCount
                nodes {
                  createdAt
                  comments(first: 1) {
                    nodes {
                      createdAt
                    }
                  }
                }
              }
              participants() {
                totalCount
              }
              reactions() {
                totalCount
              }
              timeline(){
                totalCount
              }
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
    }`
      .replace(/(?:\r\n|\r|\n)/g, "")
      .replace(/  +/g, " ")
  }
}
