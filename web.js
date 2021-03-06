var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var os = require('os');
var passport = require('passport');
var path = require('path');
var soynode = require('soynode');
var LocalStrategy = require('passport-local').Strategy;
var QcUser = require('./model/QcUser');
var WeiboStrategy = require('passport-weibo').Strategy;

var weiboEnv = {
    appKey: process.env.WEIBO_APP_KEY,
    appSecret: process.env.WEIBO_APP_SECRET,
    callbackURL: "/auth/weibo/callback"
}

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
    mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/myApp');
    configurePassport();
    require('./routes/index')(app);
    require('./auth/login')(app);
    soynode.compileTemplates('views', function(err) {
        if (err) throw err;
        http.createServer(app).listen(app.get('port'), function() {
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
                templatePath.replace('.soy', path.sep + options['function']);
            templatePath = templatePath.split(path.sep).join('.');
            callback(null, options.soynode.render(templatePath, options));
        };

        /* use soy template */
        app.engine('.soy', soyRenderer);
        app.use(function(req, res, next) {
            res.locals.soynode = soynode;
            next();
        });

        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        /* init passport */
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(app.router);
        app.use(express["static"](__dirname + "/www/"));
    });
}

function configurePassport() {
    passport.use(QcUser.createStrategy());
    
    passport.serializeUser(QcUser.serializeUser());
    passport.deserializeUser(QcUser.deserializeUser());
}