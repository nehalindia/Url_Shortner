const  express = require('express')
const app = express()
const port = 3000
const route = require('./route/route')
const bodyparser = require('body-parser')
const {default : mongoose } = require('mongoose')

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://rraj34361:bXgwmkpBz9CHdAfr@cluster0.brjrlou.mongodb.net/Ravi34361", {
    useNewUrlParser :true
}).then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err)
})










app.use('/',route)





app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 