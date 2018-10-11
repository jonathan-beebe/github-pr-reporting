import { PullRequest } from "../lib/models/PullRequest"
import { Api, PagedCallbackResult } from "../lib/api/Api"
import { renderToCSV } from "../lib/rendering/renderToCSV"
import { toPullRequest } from "../lib/utils/pullRequestFromJson"
import { groupPullRequestByDate } from "../lib/utils/groupPullRequestByDate"
import { PullRequestStats, gatherStats } from "../lib/rendering/renderToCSV"
import * as chart from "chart.js"

let myChart

function renderToChart(data: PullRequestStats[]) {
  const config = {
    type: "bar",
    options: {
      animation: {
        duration: 0,
      },
    },
    data: {
      labels: data.map(stats => stats.start),
      datasets: [{
        label: "Number of Pull Requests",
        data: data.map(stats => stats.count),
      }],
    },
  }

  const canvas = document.getElementById("chart") as HTMLCanvasElement
  const ctx = canvas.getContext("2d")
  if (myChart) {
    myChart.config = config
    myChart.update()
  }
  else {
    myChart = new chart.Chart(ctx, config)
  }
}

const args: any = process.argv
  .slice(2)
  .map(arg => arg.split(":"))
  .reduce((result, [value, key]) => {
    result[value] = key
    return result
  }, {})

function flattenPages(pagesArray) {
  return pagesArray.map(page => page.data.repository.pullRequests.edges).reduce((result, next) => {
    return result.concat(next)
  }, [])
}

function extractNode(data) {
  return data.map(pr => pr.node)
}

function mapToPullRequestModel(data): PullRequest[] {
  return data.map(toPullRequest)
}

function main() {
  document.getElementById("loading-progress-value").innerHTML = `${0}%`
  document.getElementById("progress-bar-inner").style.width = `${0}%`

  const token = new URLSearchParams(window.location.search).get("token")
  const owner = new URLSearchParams(window.location.search).get("owner")
  const repo = new URLSearchParams(window.location.search).get("repo")
  const pages = Number(new URLSearchParams(window.location.search).get("pages") || 3)
  if (token && owner && repo) {
    fetchDataWithToken(token, owner, repo, pages)
    const form = document.getElementById("form")
    form.parentNode.removeChild(form)
  }
}

function fetchDataWithToken(token: string, owner: string, repo: string, pages: number) {
  let currentPage = 0
  const maxPages = pages
  const api = new Api("https://api.github.com/graphql")

  const render =data => {
    Promise.resolve(data)
      .then(flattenPages)
      .then(extractNode)
      .then(mapToPullRequestModel)
      .then(groupPullRequestByDate)
      .then(grouped => grouped.map(gatherStats))
      .then(renderToChart)
      .catch(err => {
        console.log(`
          Error rendering,
          ${err}
        `)
      })
  }

  const accumulatedPages = []

  api
    .fetchPagesOfPullRequests(
      owner,
      repo,
      token,
      (data): PagedCallbackResult => {
        currentPage += 1
        const progress = currentPage / pages
        const progressStr = `${(progress * 100).toFixed(0)}%`
        document.getElementById("loading-progress-value").innerHTML = `${progressStr}`
        document.getElementById("progress-bar-inner").style.width = `${progressStr}`
        accumulatedPages.push(data)
        render(accumulatedPages)
        return currentPage >= maxPages ? PagedCallbackResult.STOP : PagedCallbackResult.CONTINUE
      },
    )
    .then(render)
    .catch(err => {
      console.log(`
        Error in main.
        ${err}
      `)
    })
}

main()
