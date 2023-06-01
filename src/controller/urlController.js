const urlModel = require('../models/urlModel')
const NodeCache = require('node-cache')
const cache = new NodeCache();
const validUrl = require('valid-url')
const shortid = require('shortid');
 

const createShortUrl = async function(req,res){
    try{
        if(!req.body.url){
            return res.status(400).send({status :false, message: "Must add Any Url"})
        }
        let url = req.body.url
        if (!validUrl.isUri(url)){
            return res.status(400).send({status :false, message: "Not a valid Url"})
        }
        url = url.toLowerCase()
        let check = await urlModel.findOne({longUrl : url}).select({urlCode:1, shortUrl:1, longUrl:1, _id:0})
        if(check){
            cache.set(check.urlCode, url, 60*60*60)
            return res.status(200).send({status:true, data:check })
        }
        else{
            let code = shortid.generate().toLowerCase()
            let data = {longUrl : url, urlCode: code, shortUrl: "http://localhost:3000/"+code }
            let result = await urlModel.create(data)
            cache.set(code, data.longUrl, 60*60*60*60)
            let my = {longUrl: result.longUrl, shortUrl: result.shortUrl, urlCode: result.urlCode}
            return res.status(200).send({status:true, data:my})
        }
    }catch(error){
        res.status(500).send({status : false,message: error.message})
    }
}

const getUrl = async function(req,res){
    try{
        if(!req.params.urlCode) {
            return res.status(400).send({status :false, message: "Must send complete Url"})
        }
        if(!shortid.isValid(req.params.urlCode)){
            console.log(req.params.urlCode)
            return res.status(400).send({status :false, message: "Not a valid Url"})
        }
        let code = req.params.urlCode
        if (cache.has(code)) { console.log("cache exist")}
        else{   console.log("cache not exist")}
          
        const checkCache = cache.get(code);
        console.log(checkCache,req.rawHeaders[7])
        if(checkCache){
            return res.status(302).redirect(checkCache);
        }
        //return res.status(200).send({status :true, message: checkCache})
        let data = await urlModel.findOne({urlCode: req.params.urlCode}).select({urlCode:1, shortUrl:1, longUrl:1, _id:0})
        if(!data){
            return res.status(403).send({status :false, message: "Not a valid Url"})
        }else{
            res.status(302).redirect(data.longUrl);
        }
    }catch(error){
        res.status(500).send({status : false,message: error.message})
    }
}

module.exports = {createShortUrl,getUrl}