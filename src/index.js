const  express = require('express')
const app = express()
const port = 3000
const route = require('./route/route')
const dotenv = require('dotenv')
const {default : mongoose } = require('mongoose')
dotenv.config()

app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser :true
}).then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err.message)
})

app.use('/',route)


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(process.env.PORT, () => console.log(`App is listening on port `)) 