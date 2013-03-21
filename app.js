var express = require('express');
var engines = require('consolidate');
var path = require('path');
var fs = require('fs');
var app = express();


app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.engine('html', engines.underscore);
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.send(500, "Internal server error.  Have a good day!");
    });
});

app.get('/eteDoodle', function (req, res) {
   res.render('eteDoodle.html');
});

app.post('/eteDoodle/saveSnapshot', function (req, res) {
    var imageDataUrl = req.body.imageData;
    var indexOfComma = imageDataUrl.indexOf(',');
    var imageData = imageDataUrl.substring(indexOfComma + 1);
    console.log("URL Part = " + imageDataUrl.substring(0, indexOfComma));
    var decodedImage = new Buffer(imageData, 'base64').toString('binary');
    fs.writeFile('snapshot.png', decodedImage, 'binary', function(err) {});
});

app.listen(3000);
console.log('Listening on port 3000');
