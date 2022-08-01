const express = require('express')
//const compression = require('compression')
const request = require('request')
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//app.use(compression())
////app.use(express.static('./static'))

const botUrl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=";
const botkey = "b27bdcd6-b0d2-4c4c-9ac8-2fee88634441";

app.post('/alert', function (req, res) {
    var issue = req.body;

    console.log(issue);
    console.log(JSON.stringify(issue));

    var alert = {
        "msgtype": "text",
        "text": {
            "content": JSON.stringify(issue)
        }
    }

    /*request({
        url: botUrl + botkey,
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(alert)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    }); */
    res.send("alert ok!");
});

app.get("/test",function(req,res){
    var url="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b27bdcd6-b0d2-4c4c-9ac8-2fee88634441";

    var alert = {
        issue: {
          id: 'S9msCx-eT0yItxxB5KPhYg',
          type: 'change',
          start: 1659333895188,
          text: 'Integration test',
          description: 'It works!',
          link: 'https://www.ibm.com/docs/obi/current?topic=alerting-webhooks',
          customZone: 'not available',
          availabilityZone: 'not available',
          zone: 'not available',
          fqdn: 'not available',
          entity: 'not available',
          entityLabel: 'not available',
          tags: 'not available',
          container: 'not available',
          service: 'not available',
          containerNames: []
        }
      }
    
    console.log(JSON.stringify(alert));
    var msg = {
        "msgtype": "text",
        "text": {
            "content": JSON.stringify(alert)
        }
    }

    request({
        url: url,
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(msg)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 请求成功的处理逻辑
        }
    }); 

});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('server running')
    console.log('Server running : http://%d:%d', host, port);
   
})