const express = require('express')
const compression = require('compression')
const https = require('https')
const fs = require('fs')
const app = express()
const options = {
    cert: fs.readFileSync('certs/domain.crt'),
    key: fs.readFileSync('certs/domain.key')
}

// 一定要把这一行代码写到静态资源托管前
app.use(compression())
app.use(express.static('./static'))

app.get("/test",function(req,res){
    console.log("test")
    return;
});


var server = https.createServer(options, app)
server.listen(9443, ()=>{
    console.log('server running')
})