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
    appKey: "sampleKey",
    appSecret: "sampleSecret",
    callbackURL: "http://127.0.0.1:8000/auth/weibo/callback"
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

    passport.use(new WeiboStrategy({
            clientID: weiboEnv.appKey,
            clientSecret: weiboEnv.appSecret,
            callbackURL: weiboEnv.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            QcUsers.findOne({weiboId : profile.id}, function(err, oldUser){
                if(oldUser){
                    done(null,oldUser);
                }else{
                    var newUser = new QcUsers({
                        weiboId: profile.id,
                        email : profile.emails[0].value,
                        name : profile.displayName
                    }).save(function(err,newUser){
                        if(err) throw err;
                        done(null, newUser);
                    });
                }
            });
        }));

    passport.serializeUser(QcUser.serializeUser());
    passport.deserializeUser(QcUser.deserializeUser());
}