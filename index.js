//les modules a besoin
var express= require("express");
var app=express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks=require('nunjucks');
const dbconfig=require('./config/database')
const passport=require('passport');
const session = require('express-session');
const expressValidator=require('express-validator');
const flash = require('express-flash')
const methodOverride = require('method-override');
var User = require('./models/user');
//initialisation
app.set('port', 3000);
//dirname
app.use('/js',express.static(__dirname+"/public/js"));
app.use('/css',express.static(__dirname+"/public/css"));
app.use('/images',express.static(__dirname+"/public/images"));
//pour body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//connecter à la base donnée
mongoose.Promise = global.Promise;
mongoose.connect(dbconfig.database, { useMongoClient:true }, function(err,database){
  if (err) {
    console.log(err);
  }
  else {
    console.log("connecté");
  }
});
//pour express-session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
//pour express-validator
app.use(expressValidator());
//Middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
//flash
app.use(flash());
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});
//pour methodOverride
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));
// variable global disponible dans tous les routes
app.get('*',function(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.path = req.path ;
  next();
});
//les routes
app.get('/',function(req,res){
	if (req.user) {
		console.log(req.user._id);
	}
	res.render("public/intro.html",{title:"intro"});
});
app.get('/Interdit',function(req,res){
  console.log(req.path);
	res.render("errors/401.html",{title:"401"});

});
app.get('/Medcin',function(req,res){
  User.findOne({role:'admin'}, function(err, user){
    if (err) {
      console.log(err);
    }else {
      res.render("public/medcin.html",{title:"Medcin",admin:user});
    }
  });


});

app.use('/user',require('./controllers/user'));
//app.use('/login',require('./controllers/loginUser'));
app.use('/agenda',require('./controllers/agenda'));
//pour nunjucks
nunjucks.configure("views",{
	autoescape:true,
	express:app
});
//serveur
app.listen(app.get('port'),function(){
	console.log("raissi amri smiri ");
	console.log("raissi amri smiri ");
});
