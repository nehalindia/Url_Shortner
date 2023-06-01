const  express = require('express')
const app = express()
const port = 3000
const route = require('./route/route')
const {default : mongoose } = require('mongoose')

app.use(express.json())

mongoose.connect("mongodb+srv://nehaluddindpe:RCGtWC3HqBQUfNeR@cluster0.wzbtyg0.mongodb.net/urlshortner?retryWrites=true&w=majority", {
    useNewUrlParser :true
}).then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err.message)
})

app.use('/',route)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App is listening on port ${port}`)) 
