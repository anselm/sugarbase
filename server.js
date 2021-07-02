const express = require('express')
const app = express()
const port = 3456

app.use(express.static('public'))

app.get('/basic-site.html', (req, res) => { res.sendFile(__dirname + '/public/basic-site.html') })

app.get('/*', (req, res) => { res.sendFile(__dirname + '/public/fancy-site.html') })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
