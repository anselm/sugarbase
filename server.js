const express = require('express')
const app = express()
const port = 8000

// handle various demos by overlaying successively richer file systems onto the server

switch(process.argv.length >= 3 ? process.argv[2] : "default") {
  case "demo3":
    console.log("Including demo 3")
    app.use(express.static('public3'))
  case "demo2":
    console.log("Including demo 2")
    app.use(express.static('public2'))
  default:
    console.log("Including basic demo")
    app.use(express.static('public'))
}

// route everything that is not a static file to index.html

switch(process.argv.length >= 3 ? process.argv[2] : "default") {
  case "demo3":
    app.get('/*', (req, res) => { res.sendFile(__dirname + '/public3/index.html') })
    break
  case "demo2":
     app.get('/*', (req, res) => { res.sendFile(__dirname + '/public2/index.html') })
    break
  default:
    app.get('/*', (req, res) => { res.sendFile(__dirname + '/public/index.html') })
 }

// go

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

