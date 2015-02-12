var http = require("http");
var fs = require("fs");
var url = require('url');
var path = require('path');
var express = require('express');

var app = express();

app.get('/', function(req, res){
	console.log("server start");
   fs.readFile("./index.html", function(error, content) {
       if ( error ) {
           res.writeHead(500);
           res.end();
       } else {
           res.writeHead(200, {'Content-Type': 'text/html'});
           res.end(content, 'utf-8');
       }
   });
});

app.get(/^\/(?:css|js|img|fonts)\/.+/, function(req, res) {
    var contentType = undefined
      , filePath = __dirname + req.url;
	var requestFileNameArray = req.url.split("?");
	var requestFileName = requestFileNameArray[0];
    switch( path.extname(requestFileName) ) {
    case '.css':
        contentType = 'text/css';
        break;
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.ttf':
        contentType = 'application/x-font-ttf';
        break;
    case '.png':
        contentType = 'image/png';
        break;
    default:
        contentType = 'text/html';
    }

	if(contentType != 'image/png'){
            fs.readFile(filePath, function(error, content) {
                if ( error ) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                }
            });
	}else{
		res.writeHead(200, {"Content-Type":"image/png"});
		requestFileNameArray = filePath.split("?");
		requestFileName = requestFileNameArray[0];
    	var output = fs.readFileSync(requestFileName);
		res.end(output);
		console.log("aft_read:"+filePath);
	}

});

server = http.createServer(app);
server.listen(process.env.PORT || 3000, function(){});

//app.listen(3000);
