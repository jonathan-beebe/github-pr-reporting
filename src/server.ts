import * as express from "express"

const server = express()
console.log(__dirname)
server.use(express.static(__dirname + "/html"))

const port = 5000
server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
