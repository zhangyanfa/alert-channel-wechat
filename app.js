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

var botUrl = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=";
//const botkey = "b27bdcd6-b0d2-4c4c-9ac8-2fee88634441";
var botkey="";

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


app.post('/alert/:botkey', function (req, res) {
    var alert = req.body;

    botkey = req.params["botkey"];
    console.log("====botkey====" + botkey);

    if( alert == null || alert == "" ) {
        res.send("alert fail!");
    }
    console.log(alert.issue);
    console.log(JSON.stringify(alert.issue));

    var color = "";
    var type = "";
    if( 5 == alert.issue.severity ) {
        color = "warning";
        type = "警告:";
    } else if( 10 == alert.issue.severity ) {
        color = "warning";
        type = "严重:";
    } else if( -1 == alert.issue.severity ) {
        color = "";
    }


    var msg = null;

    if( alert.issue.state == "OPEN" ) {
        mongo.addEvent(alert.issue);
        msg = {
            "msgtype": "markdown",
            "markdown": {
                "content": "<font color=\""+color+"\">" + type + alert.issue.text + "</font> [告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")"
            }
        }
        console.log(msg)
        request({
            url: botUrl + botkey,
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

    } else if( alert.issue.state == "CLOSED" ) {

        mongo.closeEvent(alert.issue);

        mongo.getEvent(alert.issue.id, function(eventObj) {
            var during = (alert.issue.end - eventObj.start)/60

            

            msg = {
                "msgtype": "markdown",
                "markdown": {
                    "content": "<font color=\"info\">关闭:"+alert.issue.text+" 持续时间:" + during
                             + "分钟</font> [告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")"
                }
            }
            console.log(msg);
            request({
                url: botUrl + botkey,
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
        })

        
    }

    

    
    res.send("alert ok!");
});

app.get("/test",function(req,res){
    var url="https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b27bdcd6-b0d2-4c4c-9ac8-2fee88634441";

    var alert = {
        issue: {
            id: '3R_L-38cSVabLeRR2hcmhg',
            type: 'incident',
            state: 'OPEN',
            start: 1659451590000,
            severity: 5,
            text: 'CPU工作负载太高',
            suggestion: 'CPU工作负载太高',
            link: 'https://9.46.76.13/#/events;eventId=3R_L-38cSVabLeRR2hcmhg?&timeline.ws=600000&timeline.to=1659451890000&timeline.fm=1659451590000&incidentId=3R_L-38cSVabLeRR2hcmhg&incidentTo=1659451595000',
            customZone: 'not available',
            availabilityZone: 'not available',
            zone: 'not available',
            fqdn: 'itzvm-310001k9hr-ec9o3jfy-vm.fyre.ibm.com',
            entity: 'Host',
            entityLabel: 'itzvm-310001k9hr-ec9o3jfy-vm.fyre.ibm.com',
            tags: '',
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
    var during = 32232;
    msg = {
        "msgtype": "markdown",
        "markdown": {
            "content": "<font color=\"info\">告警关闭:"+alert.issue.text+" 持续时间:" + during
                     + "</font> [告警详情]("+hostUrl+"/detail?eventid="+alert.issue.id+")"
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