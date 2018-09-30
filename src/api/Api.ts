"use strict"

import { QueryBuilder } from "./QueryBuilder"
import axios from "axios"

const userAgent = "github-graphql-test-app"

export enum PagedCallbackResult {
  CONTINUE,
  STOP,
}

interface FetchPullRequestsPageInfoJson {
  startCursor: string
}

interface FetchPullRequestsJson {
  pageInfo: FetchPullRequestsPageInfoJson
}

interface FetchPullRequestsRepositoryJson {
  pullRequests: FetchPullRequestsJson
}

interface FetchPullRequestsDataJson {
  repository: FetchPullRequestsRepositoryJson
}

interface FetchPullRequestsRootJson {
  data: FetchPullRequestsDataJson
}

type PageCallback = (data: object) => PagedCallbackResult

export class Api {
  private root: string

  constructor(root: string) {
    this.root = root
  }

  async fetchPullRequests(
    owner: string,
    repo: string,
    token: string,
    nextCursor?: string
  ): Promise<FetchPullRequestsRootJson> {
    const queryBuilder = new QueryBuilder()
      .withOwner(owner)
      .withRepoName(repo)
      .withBeforeCursor(nextCursor)

    const requestOptions = {
      headers: {
        "User-Agent": userAgent,
        "Authorization": `bearer ${token}`,
      },
    }

    return new Promise<FetchPullRequestsRootJson>((resolve, reject) => {
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
  ): Promise<FetchPullRequestsRootJson[]> {
    return new Promise<FetchPullRequestsRootJson[]>(async (resolve, reject) => {
      const pages: FetchPullRequestsRootJson[] = []

      try {
        const firstPage = await this.fetchPullRequests(owner, repo, token)
        pages.push(firstPage)
      } catch (error) {
        reject(error)
        return
      }

      while (pageCallback(pages[pages.length - 1]) === PagedCallbackResult.CONTINUE) {
        const lastPage = pages[pages.length - 1]
        const pageInfo = lastPage.data.repository.pullRequests.pageInfo

        try {
          const data = await this.fetchPullRequests(owner, repo, token, pageInfo.startCursor)
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
