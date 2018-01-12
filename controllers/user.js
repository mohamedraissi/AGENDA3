const express = require('express');
const userRouter = express.Router();
var app=express();
const bcryptjs=require('bcryptjs');
const passport=require('passport');
var session = require('express-session');
var flash = require('express-flash');
const expressValidator=require('express-validator');
var User = require('../models/user');
var Agenda = require('../models/agenda');

//route d'un rendez-vous (seul patiant
userRouter.get('/rendez-vous/:_id',userAdminIsLoggedIn,function(req,res){
		 Agenda.find({_id:req.params._id}).populate('patient').exec(function(err,patient){
			 if (err) {
			 	console.log(err);
			}
				else {
					res.render("admin/rdv.html",{patient:patient});
				}
		 });
		 });

//formulaire de connexion  admin(get)
userRouter.get('/admin/connexion',function(req,res){
	User.find({}, function(err, user){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			User.count({role:"admin"},function(err,c){
				if (err) {
					console.log(err);
				}else {
					if(c==0){
						var user = new User(
							{
								firstname:"admin",
								lastname:"admin",
								username: "admin",
								role:"admin",
								tel:"93 242 036",
								specilaite:"dentiste",
								adresse:"19 rue allyssa carthage byrsa",
								password:"admin",
							}
						);
						bcryptjs.genSalt(12, function(err, salt) {
							bcryptjs.hash(user.password, salt, function(err, hash) {
									if (err) {
										console.log(err);
									}
									else {
										user.password=hash;
										user.save((err) => {
											if (err) {
												console.log(err);
												if (err.code == 11000 ) {
													res.json({ message : 'user already exists' });
												}
												else {
													res.send(err);
												}
											}
										});
									}
							});
					});
					}

				}
			});
		}
	});
  res.render('admin/login.html');
});
//récupérer tous les utilisateurs
userRouter.get('/',userAdminIsLoggedIn,function(req,res){
  User.find({}, function(err, user){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
			User.count({role:"patient"},function(err,c){
				if (err) {
					console.log(err);
				}else {
					console.log(c+"*************");
				}
			});
      console.log(user);
			console.log(res.locals.sessionFlash);
      res.render('admin/users.html',{title:"Nos patient",users:user ,expressFlash: req.flash('danger'), sessionFlash: res.locals.sessionFlash});
    }
  });
  });
	 //route coordonnees Medcin
	 userRouter.get('/admin/coordonnees',userAdminIsLoggedIn,function(req,res){
		 User.findOne({role:"admin"}, function(err, user){
			 if (err) {
			 	console.log(err);
			 }
			 else {
			 	res.render('admin/coordonnnes.html',{title:"coordonnes",user:user});
			 }
		 });

   });
  //route d'agenda admin
  userRouter.get('/admin/agenda',userAdminIsLoggedIn,function(req,res){
    res.render('admin/agenda.html');
  });
  //formulaire de connexion (get)
  userRouter.get('/connexion',function(req,res){
		console.log(res.locals.sessionFlash);
    res.render('Auth/login.html',{ expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
  });
  //route pour le profile
	userRouter.get('/profile/:username',userPatientIsLoggedIn,function(req,res){
		User.find({username:req.params.username},function(err,patient){
			if (err) {
			 console.log(err);
		 }
			 else {
				 console.log(patient[0]._id);
				 Agenda.find({patient:patient[0]._id},function(err,agenda){
					 if (err) {
						 console.log(err);

					 }else {
					 	console.log(agenda);
						res.render("Auth/profile.html",{agenda:agenda,patient:patient});
					 }
				 });
			 }
		});
  });
  // route pour la deconnexion
  userRouter.get('/deconnexion',userPatientIsLoggedIn,(req,res)=>{
    req.logout();
    res.redirect('/user/connexion');
  });
  // route pour la deconnexion admin
  userRouter.get('/admin/deconnexion',userAdminIsLoggedIn,(req,res)=>{
    req.logout();
    res.redirect('/user/admin/connexion');
  });
  //formulaire de inscription (get)
  userRouter.get('/inscription',function(req,res){
    res.render('Auth/inscri.html',{
      title:'inscription',
    });
  });
//récupérer un seul utilisateur
userRouter.get('/:username', function(req,res){
  User.findOne({ username: req.params.username }, function(err, user){
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(user);
      res.json(user);
    }
  });
});

//ajouter un utilisateur
userRouter.post('/inscription', function(req, res){
  req.checkBody('firstname','le nom est requis').notEmpty();
  req.checkBody('lastname','le prenom est requis').notEmpty();
	req.checkBody('tel','le Téléphone est requis').notEmpty();
  req.checkBody('adresse','l\'adresse est requis').notEmpty();
  req.checkBody('username','le pseudo est requis').notEmpty();
  req.checkBody('password','le mot de passe est requis').notEmpty();
  var errors=req.validationErrors();
  if (errors) {
    res.render('Auth/inscri.html',{
      title:'inscription',
      errors:errors,
    });
  }
  else {
    var user = new User(
      {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username,
        role:req.body.role,
        password:req.body.password,
				tel:req.body.tel,
				adresse:req.body.adresse,
      }
    );
    bcryptjs.genSalt(12, function(err, salt) {
      bcryptjs.hash(user.password, salt, function(err, hash) {
          if (err) {
            console.log(err);
          }
          else {
            user.password=hash;
            user.save((err) => {
              if (err) {
                console.log(err);
                if (err.code == 11000 ) {
                  res.json({ message : 'user already exists' });
                }
                else {
                  res.send(err);
                }
              } else {
                console.log('user saved successfully');
								req.session.sessionFlash = {
									        type: 'success',
									        message: 'Ce utilisateur est déja existant dans la base de donnée ! .'
									    }
                res.redirect("connexion");
              }
            });
          }
      });
  });
  }

});
//mettre à jour
userRouter.put('/admin/:_id', (req, res) => {
  User.update({ _id: req.params._id }, req.body, (err) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
        console.log('user updated successfully');
        res.json({ success: true});
    }
  });
});

//supprimer un utilisateur
userRouter.delete('/delete/:_id',(req, res) => {
  User.remove({_id:req.params._id}, (err, user) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
     response = {
        message: "user successfully deleted",
    };
    res.status(200).send(response);
		req.session.sessionFlash = {
							type: 'danger',
							message: 'delete'
					}

  }
});
});

//formulaire de connexion (Post)
userRouter.post('/connexion',function(req,res,next){
  passport.authenticate('local',
    {
      session: true,
      successRedirect:'/user/profile/'+req.body.username,
      failureRedirect:'/user/connexion',
    }
  )(req,res,next);
});

userRouter.post('/admin/connexion',function(req,res,next){

  passport.authenticate('local',
    {
      session: true,
      successRedirect:'/user/admin/agenda',
      failureRedirect:'/user/admin/connexion',
			
    }
  )(req,res,next);
});

function userPatientIsLoggedIn(req, res, next) {

    // Si l'utilisateur est authentifié dans la session et de role patient, continuez
    if (req.isAuthenticated() && req.user.role=="patient"){

      return next();
    }
    else {
      // s'ils ne les redirigent pas vers la page Interdit
      res.redirect('/Interdit');
    }
}

function userAdminIsLoggedIn(req, res, next) {

    // Si l'utilisateur est authentifié dans la session et de role admin, continuez
    if (req.isAuthenticated() && req.user.role=="admin"){

      return next();
    }
    else {
      // s'ils ne les redirigent pas vers la page Interdit
      res.redirect('/Interdit');
    }
}
module.exports = userRouter;
