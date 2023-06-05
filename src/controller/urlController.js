const urlModel = require('../models/urlModel')
const NodeCache = require('node-cache')
const cache = new NodeCache();
const validUrl = require('valid-url')
const shortid = require('shortid');
const redis = require("redis");
const { promisify } = require("util");
// const { nanoid } = require('nanoid');
// const { isNanoid } = require('nanoid');


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



const createShortUrl = async function(req,res){
    try{
        let longUrl = req.body.longUrl
        let arr = longUrl.split(":")
        arr[0] = "https"
        longUrl = arr.join(":")
        let protocol = req.protocol;
       
        let rawHeaders = req.rawHeaders
        let hostName = req.headers.host

        // for(let i = 0; i<rawHeaders.length; i++){
        //     if(rawHeaders[i].includes('Host')){
        //         hostName = rawHeaders[i+1] 
        //     }
        // }
        // console.log(req.headers)
        
        if(!longUrl){
            return res.status(400).send({status :false, message: "Must add Any Url"})
        }
   
        if (!validUrl.isWebUri(longUrl)){
            return res.status(400).send({status :false, message: "Not a valid Url"})
        }
        longUrl = longUrl.toLowerCase()
        

    //3. Start using the redis commad
 
        let check = await urlModel.findOne({longUrl : longUrl}).select({urlCode:1, shortUrl:1, longUrl:1, _id:0})
        if(check){
          
            await SET_ASYNC(check.urlCode, check.longUrl, 'EX', 3600*24)       
            return res.status(200).send({status:true, data:check })
        }
    

        else{
            let code = shortid.generate().toLowerCase()
           
            // console.log(code)
            let data = {longUrl : longUrl, urlCode: code, shortUrl: `${protocol}://${hostName}/${code}` }
            // let data = {longUrl : longUrl, urlCode: code, shortUrl: "http://localhost:3000/"+code }
            let result = await urlModel.create(data)
           
            await SET_ASYNC(result.urlCode, result.longUrl, 'EX', 3600*24)
            let my = {longUrl: result.longUrl, shortUrl: result.shortUrl, urlCode: result.urlCode}
            return res.status(201).send({status:true, data:my})
        }
    }catch(error){
        res.status(500).send({status : false,message: error.message})
    }
}

const getUrl = async function(req,res){
    try{
        
        let code = req.params.urlCode.toLowerCase()
        if(!code) {
            return res.status(400).send({status :false, message: "Must send complete Url"})
        }
        if(!shortid.isValid(code)){
            return res.status(400).send({status :false, message: "Not a valid ShortId"})
        }
        
      
        let cahcedUrl = await GET_ASYNC(code)
        console.log(cahcedUrl)
        if(cahcedUrl) {
            console.log("cache hit")
            return   res.status(302).redirect(cahcedUrl)
        }
        
        let data = await urlModel.findOne({urlCode:code})   
        if(!data){
            return res.status(404).send({status :false, message: "url code not exists"})                     
        }else{
            console.log("cache miss")
            await SET_ASYNC(data.urlCode, data.longUrl, 'EX', 3600*24) 
            return res.status(302).redirect(data.longUrl);
        }
    }catch(error){
        return res.status(500).send({status : false,message: error.message})
    }
}

module.exports = {createShortUrl,getUrl}