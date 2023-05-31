const express = require('express')
const router = express.Router()
const {} = require('../controller/urlController')

router.post('/url/shorten')
router.get('/:urlCode')


module.exports = router