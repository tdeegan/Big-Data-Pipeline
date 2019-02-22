'use strict';
const http = require('http');
var assert = require('assert');
const express= require('express');
const app = express();
const mustache = require('mustache');
const filesystem = require('fs');
const url = require('url');
const hbase = require('hbase-rpc-client');
const hostname = '127.0.0.1';
const port = 3089;

/* Commented out lines are for running on our cluster */
var client = hbase({
    zookeeperHosts: ["localhost:2181"],
    //zookeeperHosts: ["10.0.0.2:2181"], 
    zookeeperRoot: "/hbase"
});

client.on('error', function(err) {
  console.log(err)
})

console.log(`Server running at http://${hostname}:${port}/career-highs.html`);
app.use(express.static('public'));
app.get('/stats.html',function (req, res) {
    const fullname=req.query['firstname'] + req.query['lastname'];
    const get = new hbase.Get(fullname);
    console.log(client.get("career_highs_by_name", get, function(err, row) {
	assert.ok(!err, "get returned an error: #{err}");
	if(!row){
            res.send("<html><body>No such name in data</body></html>");
            return;
        }

	function career_high(stat) {
	    var statValue = row.cols["stats:" + stat].value;
	    if(statValue == 0)
		return " - ";
	    return statValue;
	}

	var template = filesystem.readFileSync("result.mustache").toString();
	var html = mustache.render(template,  {
	    firstname : req.query['firstname'],
	    lastname : req.query['lastname'],
	    points : career_high("points"),
	    rebounds : career_high("rebounds"),
	    assists : career_high("assists"),
	    steals : career_high("steals"),
	    blocks : career_high("blocks"),
	    turnovers : career_high("turnovers")
	});
	res.send(html);
    }));
});

app.listen(port);