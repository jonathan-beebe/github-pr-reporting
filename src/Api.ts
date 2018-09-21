"use strict"

import { QueryBuilder } from "./QueryBuilder"
import axios from "axios"

const userAgent = "github-graphql-test-app"

export enum PagedCallbackResult {
  CONTINUE,
  STOP
}

type PageCallback = (data: object) => PagedCallbackResult

// An interface to describe the shape of a pull request expected from the api.
export interface PullRequestJsonObject {
  url: string
  createdAt: string
  closedAt: string
}

export class Api {
  private root: string

  constructor(root: string) {
    this.root = root
  }

  async fetchPullRequests(owner: string, repo: string, token: string, nextCursor?: string): Promise<object> {
    let queryBuilder = new QueryBuilder()
      .withOwner(owner)
      .withRepoName(repo)
      .withBeforeCursor(nextCursor)

    let requestOptions = {
      headers: {
        "User-Agent": userAgent,
        Authorization: `bearer ${token}`
      }
    }

    return new Promise<object>((resolve, reject) => {
      axios
        .post(this.root, `{ "query": "query ${queryBuilder.build()}" }`, requestOptions)
        .then(res => {
          // TODO: verify the body is not a parse error description
          resolve(res.data)
        })
        .catch(err => {
          console.log("error", err)
          reject(err)
        })
    })
  }

  async fetchPagesOfPullRequests(
    owner: string,
    repo: string,
    token: string,
    pageCallback: PageCallback
  ): Promise<object[]> {
    return new Promise<object[]>(async (resolve, reject) => {
      let pages: object[] = []
      let firstPage = await this.fetchPullRequests(owner, repo, token)
      pages.push(firstPage)
      while (pageCallback(pages[pages.length - 1]) == PagedCallbackResult.CONTINUE) {
        let lastPage = pages[pages.length - 1]
        let pageInfo = lastPage["data"].repository.pullRequests.pageInfo
        let data = await this.fetchPullRequests(owner, repo, token, pageInfo.startCursor)
        pages.push(data)
      }
      resolve(pages)
    })
  }
}
