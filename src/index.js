const  express = require('express')
const app = express()
const port = 3000
const route = require('./route/route')
const bodyparser = require('body-parser')











app.use('/',route)





app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 