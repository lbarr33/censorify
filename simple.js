var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "html/";
http.createServer(function(req,res){
	var urlObj = url.parse(req.url, true, false);
	//console.log(urlObj.pathname);
	//console.log(urlObj.search);
	//console.log(urlObj.query["q"]);
	if(urlObj.pathname.indexOf("getcity") !=-1){
	//console.log("In Rest service");
	fs.readFile('html/cities.dat.txt', function(err, data){
	if(err) throw err;
	var cities = data.toString().split("\n");
	//for(var i=0; i<cities.length;i++){
	//console.log(cities[i]);
	//}
	var reg = new RegExp("^"+urlObj.query["q"]);
	var jsonresult= [];
	for(var i=0;i<cities.length;i++){
	   var result = cities[i].search(reg);
	   if(result!=-1){
             // console.log(cities[i]);
             jsonresult.push({city:cities[i]});
		

            }
	
	}
	//console.log(jsonresult);
	res.writeHead(200);
	res.end(JSON.stringify(jsonresult));
	});


	}
	else
	{
	fs.readFile(ROOT_DIR + urlObj.pathname,function(err,data){
		if(err){
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200);
		res.end(data);
		});
	}
		}).listen(80);


