var express = require('express');
var engines = require('consolidate');
var path = require('path');
var fs = require('fs');
var app = express();
var userHomeDir = process.env['HOME'];
var snapshotImageDir = path.join(userHomeDir, 'snapshotImages');

var currImageIndex = 0;
if (!fs.existsSync(snapshotImageDir)) {
    console.log(snapshotImageDir + " does not exist");
    fs.mkdirSync(snapshotImageDir);
}
else {
    console.log(snapshotImageDir + " exists");
    // Determine greatest index and add 1
    var files = fs.readdirSync(snapshotImageDir);
    if (files && files.length > 0) {
        console.log("Number of files = " + files.length);
        var maxIndex = -1;
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf('snapshot_') == 0) {
                var underscoreIndex = files[i].lastIndexOf('_');
                var dotIndex = files[i].lastIndexOf('.');
                var fileNum = parseInt(files[i].substring(underscoreIndex + 1, dotIndex));
                if (fileNum > maxIndex) {
                    maxIndex = fileNum;
                }
            }
        }
        currImageIndex = maxIndex + 1;
        console.log("Next snapshot index = " + currImageIndex);
    }

}

console.log("User home dir = " + userHomeDir);
console.log("Snapshot image dir = " + snapshotImageDir);



app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compress());
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
    fs.writeFile(path.join(snapshotImageDir, 'snapshot_' + currImageIndex + '.png'), decodedImage, 'binary', function(err) {
        if (err) {
            console.error("Error saving image " + err.message);
            throw err;
        }
        currImageIndex++;
        res.send(200);
    });
});

app.listen(3000);
console.log('Listening on port 3000');
