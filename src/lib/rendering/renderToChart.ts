"use strict"

import * as chart from "chart.js"
import { PullRequestStats } from "./gatherStats"

let myChart

export const renderToChart = (data: PullRequestStats[]) => {
  const config = {
    type: "bar",
    options: {
      animation: {
        duration: 0,
      },
    },
    data: {
      labels: data.map(stats => stats.start),
      datasets: [
        {
          label: "Number of Pull Requests",
          data: data.map(stats => stats.count),
        },
      ],
    },
  }

  const canvas = document.getElementById("chart") as HTMLCanvasElement
  const ctx = canvas.getContext("2d")
  if (myChart) {
    myChart.config = config
    myChart.update()
  } else {
    myChart = new chart.Chart(ctx, config)
  }
}
