import { PullRequest } from "../lib/models/PullRequest"
import { Api, PagedCallbackResult } from "../lib/api/Api"
import { renderToCSV } from "../lib/rendering/renderToCSV"
import { toPullRequest } from "../lib/utils/pullRequestFromJson"

const args: any = process.argv
  .slice(2)
  .map(arg => arg.split(":"))
  .reduce((result, [value, key]) => {
    result[value] = key
    return result
  }, {})

function flattenPages(pagesArray) {
  return pagesArray
    .map(page => page.data.repository.pullRequests.edges)
    .reduce((result, next) => {
      return result.concat(next)
    }, [])
}

function extractNode(data) {
  return data.map(pr => pr.node)
}

function mapToPullRequestModel(data): PullRequest[] {
  return data.map(toPullRequest)
}

const owner = "facebook"
const repo  = "react"
const token = ""
const pages = 6

function main() {
  let currentPage = 0
  const maxPages = pages
  const api = new Api("https://api.github.com/graphql")
  api
    .fetchPagesOfPullRequests(
      owner,
      repo,
      token,
      (data): PagedCallbackResult => {
        currentPage += 1
        console.log(`fetched page ${currentPage}`)
        return currentPage >= maxPages ? PagedCallbackResult.STOP : PagedCallbackResult.CONTINUE
      }
    )
    .then(flattenPages)
    .then(extractNode)
    .then(mapToPullRequestModel)
    .then(renderToCSV)
    .then(str => document.body.innerHTML = `<pre>${str}</pre>`)
    .catch(err => {
      console.log(`
        Error in main.
        ${err}
      `)
    })
}

main()
