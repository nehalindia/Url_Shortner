const redis = require("redis");
const { promisify } = require("util");

//1. Connect to the redis server

const redisClient = redis.createClient({
    host: 'redis-16476.c212.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 16476,
    password: 'lW4mvHKbk3LHvaX3u5LxICpwGtVawdI1',
  });
  
redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

  
  
//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);



module.exports = {SET_ASYNC,GET_ASYNC}


// const createUrl = async function(req,res){
//     const url = req.body.longUrl
//     const check = await urlModel.findOne({longUrl:url})
//     if(check){
//     const response1 = {longUrl: check.longUrl, shortUrl: check.shortUrl, urlCode:check.urlCode}
//     res.status(201).send({status:true, message: response1 })
//     }
//     else{
//     const code = shortid.generate().toLowerCase()

//     const data = {longUrl: url, urlCode: code, shortUrl: `http://localhost:3000/${code}`}
//     const created = await urlModel.create(data)
//     await SET_ASYNC(data.urlCode, data.longUrl, 'Ex', 3600*24)
//     res.status(200).send({status: true, message: created})
//   }
// }