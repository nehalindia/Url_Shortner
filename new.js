const express = require('express')
const app = express()
const router = express.Router()

app.use(express.json())

router.get('/',function(res,req){
    console.log("My name is Nehal")
    res.send("My Name is Nehal")
})



app.listen(3000, function(){
    console.log("Server is running on");
})