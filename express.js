var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
app.use(bodyParser.json());
var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user,pass){
	return((user==='cs360')&&(pass==='test'));
});
var options = {
	host:'127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};
http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.get('/', function(req, res){
	res.send("Get Index");
});
app.use('/', express.static('./html',{maxAge: 60*60*1000}));
app.get('/getcity',function(req,res){
	var urlObj= url.parse(req.url,true,false);
	console.log("In getcity route");
	//res.json([{city:"Price"},{city:"Provo"}]);
	 fs.readFile('html/cities.dat.txt', function(err, data){
        if(err) throw err;
        var cities = data.toString().split("\n");
        var reg = new RegExp("^"+urlObj.query["q"]);
        var jsonresult= [];
        for(var i=0;i<cities.length;i++){
           var result = cities[i].search(reg);
           if(result!=-1){
             jsonresult.push({city:cities[i]});


            }

        }
        res.writeHead(200);
        res.end(JSON.stringify(jsonresult));
        });
});
app.get('/comment',function(req,res){
	console.log("In GET comment route");
	                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect("mongodb://localhost/weather",function(err,db){
                                if(err) throw err;
                                db.collection("comments",function(err,comments){
                                        if(err) throw err;
                                        comments.find(function(err,items){
                                                items.toArray(function(err,itemArr){
                                                        console.log("Document Array: ");
                                                        console.log(itemArr);
                                                        finalresult = itemArr;
                                                        res.writeHead(200);
                                                        res.end(JSON.stringify(itemArr));
                                                });
                                        });
                                });
                        });

});
app.post('/comment', auth, function(req,res){
	console.log("In POST comment route");
	console.log(req.body);
                   var MongoClient = require('mongodb').MongoClient;
                   MongoClient.connect("mongodb://localhost/weather",function(err,db){
                        if(err) throw err;
                        db.collection('comments').insert(req.body,function(err,records){
                                console.log("Record added as " + records[0]._id);

                        });
                   });
                   res.writeHead(200);
                   res.end("");

                });

