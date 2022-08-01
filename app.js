const express = require('express')
//const compression = require('compression')
const request = require('request')
var bodyParser = require('body-parser')
const app = express();

var mongo = require('./mongo');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//app.use(compression())
////app.use(express.static('./static'))

const hostUrl = "http://localhost:3000"

const botUrl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=";
const botkey = "b27bdcd6-b0d2-4c4c-9ac8-2fee88634441";


app.get('/detail', function(req, res) {
    var eventId = req.query.eventid;
    console.log(eventId);

    mongo.claimEvent(eventId);

    mongo.getEvent(eventId, function(eventObj) {
        res.writeHead(302, {
            location: eventObj.link,
        });
        res.end();
    });
    
});


app.post('/alert', function (req, res) {
    var alert = req.body;

    if( alert == null || alert == "" ) {
        res.send("alert fail!");
    }
    console.log(alert.issus);
    console.log(JSON.stringify(alert.issus));

    if( alert.issue.state == "OPEN" ) {

    
        mongo.addEvent(alert.issus);

        /*var alert = {
            "msgtype": "text",
            "text": {
                "content": JSON.stringify(issue)
            }
        }*/
        var msg = {
            "msgtype": "markdown",
            "markdown": {
                "content": "<font color=\"warning\">"+alert.issue.text+"</font>\n" +
                        "[告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")",
            }
        }

    } else if( alert.issue.state == "CLOSED" ) {

        mongo.closeEvent(alert.issus);

        var msg = {
            "msgtype": "markdown",
            "markdown": {
                "content": "<font color=\"info\">告警已关闭："+alert.issue.text+"</font>\n" +
                        "[告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")",
            }
        }
    }

    request({
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
    });

    
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
          severity: 5,
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
    /*var msg = {
        "msgtype": "text",
        "text": {
            "content": JSON.stringify(alert)
        }
    }*/
    var msg = {
        "msgtype": "markdown",
        "markdown": {
            "content": "<font color=\"warning\">"+alert.issue.text+"</font>\n" +
                       "[告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")",
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
            res.send("alert ok!");
        }
    }); 

});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('server running')
    console.log('Server running : http://%d:%d', host, port);
   
})