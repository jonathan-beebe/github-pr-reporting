import * as express from "express"

const server = express()
server.use(express.static(__dirname + "/"))

const port = 5000
server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
