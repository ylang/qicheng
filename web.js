var path = require('path');
var express = require('express');
var http = require('http');
var os = require('os');
var soynode = require('soynode');

soynode.setOptions({
    outputDir: os.tmpdir(),
    uniqueDir: true,
    allowDynamicRecompile: true,
    eraseTemporaryFiles: true
});

console.log("hello");
function init() {
    var app = express();
    configureExpress(app);
    require('./routes/index')(app);
    soynode.compileTemplates('views', function(err) {
        if (err) throw err;
        http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    });
}

init();

function configureExpress(app) {
    app.configure(function() {
        app.set('port', process.env.PORT || 8000);
        app.set('view engine', ".soy");

        var soyRenderer = function(_path, options, callback) {
            var templatePath =
                    _path.replace(path.normalize(this.root + '/'), '');
            templatePath =
                    templatePath.replace('.soy',path.sep + options['function']);
            templatePath = templatePath.split(path.sep).join('.');
            callback(null, options.soynode.render(templatePath, options));
        };

        app.engine('.soy', soyRenderer);
        app.use(function(req, res, next) {
            res.locals.soynode = soynode;
            next();
        });

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(app.router);
        app.use(express["static"](__dirname + "/www/"));
    });
}