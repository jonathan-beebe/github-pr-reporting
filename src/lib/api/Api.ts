"use strict"

import { QueryBuilder } from "./QueryBuilder"
import axios from "axios"
import { valueAtKeyPath } from "../utils/utils"

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
    nextCursor?: string,
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
          const code = valueAtKeyPath(err, "code")
          switch (code) {
            case "ENOTFOUND":
              console.log("check your network connection")
              break

            default:
              const status = valueAtKeyPath(err, "response.status")
              const description = valueAtKeyPath(err, "response.statusText")
              console.log(`\nRequest error! code: ${code}, status: ${status}, description: ${description}\n`)
              const errors = valueAtKeyPath(err, "response.data.errors.array")
              if (errors) {
                errors.forEach(element => {
                  console.error(element.message)
                })
              }
              break
          }

          reject(err)
        })
    })
  }

  async fetchPagesOfPullRequests(
    owner: string,
    repo: string,
    token: string,
    pageCallback: PageCallback,
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
