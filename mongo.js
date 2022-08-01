var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:example@9.46.76.213:27017/";


function addEvent(eventObj) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("glodon-poc");
        var myobj = { 
            id: eventObj.id, 
            text: eventObj.text, 
            link: eventObj.link, 
            link_status: 0,
            start: eventObj.start,
            severity: eventObj.severity,
            state: eventObj.state };
        dbo.collection("instana-event").insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
    });
}

function closeEvent(eventObj) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("glodon-poc");
        var myquery = { id: eventObj.id };
        var newvalues = { $set: { state: eventObj.state, end: eventObj.end } };
        dbo.collection("instana-event").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document closeEvent");
          db.close();
        });
    });
}

function claimEvent(eventId) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("glodon-poc");
        var myquery = { id: eventId };
        var newvalues = { $set: { link_status: 1 } };
        dbo.collection("instana-event").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document claimEvent");
          db.close();
        });
    });
}

function getEvent(eventId, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("glodon-poc");
        var myquery = { id: eventId };
        dbo.collection("instana-event").findOne(myquery, function(err, result) {
            if (err) throw err;
            console.log(result);
            callback(result);
            db.close();
        });
    });
}


var issue = {
    id: 'mTnCSR1gQsSiEQmB0kNP4Q',
    type: 'incident',
    state: 'OPEN',
    start: 1659339382000,
    severity: 5,
    text: 'cpu load to high',
    suggestion: 'cpu load to high',
    link: 'https://9.46.76.13/#/events;eventId=mTnCSR1gQsSiEQmB0kNP4Q?&timeline.ws=600000&timeline.to=1659339682000&timeline.fm=1659339382000&incidentId=mTnCSR1gQsSiEQmB0kNP4Q&incidentTo=1659339387000',
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

//addEvent(issue);
//getEvent("mTnCSR1gQsSiEQmB0kNP4Q");

exports.addEvent = addEvent;
exports.closeEvent = closeEvent;
exports.claimEvent = claimEvent;
exports.getEvent = getEvent;