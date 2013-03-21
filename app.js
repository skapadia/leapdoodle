var express = require('express');
var engines = require('consolidate');
var path = require('path');
var app = express();


app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.engine('html', engines.underscore);
});

app.get('/eteDoodle', function (req, res) {
   res.render('eteDoodle.html');
});

app.listen(3000);
console.log('Listening on port 3000');
