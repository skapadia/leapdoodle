var express = require('express');
var engines = require('consolidate');
var path = require('path');
var fs = require('fs');
var Leap = require('leapjs').Leap;
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

var allowCrossDomain = function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');

    next();
};

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(express.compress());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.favicon(path.join(__dirname, 'public/images/chariot_horse.png')));
    app.engine('html', engines.underscore);
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.send(500, "Internal server error.  Have a good day!");
    });
});

app.get('/eteDoodle', function (req, res) {
   res.render('eteDoodle.html');
});

app.get('/eteDoodle/snapshots/count', function (req, res) {
   res.json({ snapshotCount: currImageIndex });
});

// TODO: Serve images for the slideshow web page

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

/*
var controller = new Leap.Controller({enableGestures: true});
controller.on('frame', function(frame) {
    /*console.log("Frame event");
    // If only a finger is showing, number of hands can be zero
    console.log("# of fingers = " + frame.pointables.length);
    // Tip position is in millimeters from the Leap origin
    for (var i = 0; i < frame.pointables.length; i++) {
        console.log("Finger position = " + frame.pointables[i].toString());
    }
    if (frame.gestures && frame.gestures.length == 1) {
        if (frame.gestures[0].type === 'screenTapGesture')
        console.log("Gesture type = " + frame.gestures[0].type);
        console.log("Gesture position = " + frame.gestures[0].position);
    }
});
controller.connect();
*/


