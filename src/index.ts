import { PullRequest } from "./PullRequest"
import { Api, PagedCallbackResult, PullRequestJsonObject } from "./Api"
import { renderToCSV } from "./renderToCSV"

const args: any = process.argv
  .slice(2)
  .map(arg => arg.split(":"))
  .reduce((args, [value, key]) => {
    args[value] = key
    return args
  }, {})

function toPullRequest(obj: PullRequestJsonObject): PullRequest {
  let url = obj.url
  let createdAt = new Date(obj.createdAt)
  let closedAt = new Date(obj.closedAt)
  return new PullRequest(url, createdAt, closedAt)
}

function flattenPages(pages) {
  return pages.map(page => page["data"].repository.pullRequests.edges).reduce((result, next) => {
    return result.concat(next)
  }, [])
}

function extractNode(data) {
  return data.map(pr => pr.node)
}

function mapToPullRequestModel(data): PullRequest[] {
  return data.map(toPullRequest)
}

const owner = args.owner
const repo = args.repo
const token = args.token
const pages = args.pages || 3

function main() {
  if (!token || !repo || !owner) {
    console.log("Missing required parameter. You must specify the github owner, repo name, and github token.")
    console.log("Usage example:")
    console.log("  npm run compileAndRun -- owner:facebook repo:react token:...your github token here...")
    return
  }

  let currentPage = 0
  const maxPages = pages
  new Api("https://api.github.com/graphql")
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
    .then(console.log)
    .catch(err => console.log(err))
}

main()
