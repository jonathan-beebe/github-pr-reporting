"use strict"

import { QueryBuilder } from "./QueryBuilder"
import axios from "axios"

const userAgent = "github-graphql-test-app"

export enum PagedCallbackResult {
  CONTINUE,
  STOP
}

type PageCallback = (data: object) => PagedCallbackResult

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
          console.log(`\nRequest error! code: ${err.response.status}, description: ${err.response.statusText}\n`)
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

      try {
        let firstPage = await this.fetchPullRequests(owner, repo, token)
        pages.push(firstPage)
      } catch (error) {
        reject(error)
        return
      }

      while (pageCallback(pages[pages.length - 1]) == PagedCallbackResult.CONTINUE) {
        let lastPage = pages[pages.length - 1]
        let pageInfo = lastPage["data"].repository.pullRequests.pageInfo

        try {
          let data = await this.fetchPullRequests(owner, repo, token, pageInfo.startCursor)
          pages.push(data)
        } catch (error) {
          reject(error)
          return
        }
      }

      resolve(pages)
    })
  }
}
