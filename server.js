const express = require('express')
const app = express()
const port = 3456

app.use(express.static('public'))

app.get('/basic', (req, res) => { res.sendFile(__dirname + '/public/basic-site/index.html') })

app.get('/*', (req, res) => { res.sendFile(__dirname + '/public/index.html') })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
