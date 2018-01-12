const express = require('express');
const agendaRouter = express.Router();
var Agenda = require('../models/agenda');
//delete rendez-vous
agendaRouter.delete('/rdv/delete/:_id',(req, res) => {
  Agenda.remove({_id:req.params._id}, (err, user) => {
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
agendaRouter.get('/res',function(req,res){
		 Agenda.find({}, function(err, agenda){
		 	var event=[]
		 	for (var i  in agenda) {
		 		event.push({start:agenda[i].debut+"+00:00",end:agenda[i].fin+"+00:00",url:'/user/rendez-vous/'+agenda[i]._id});
		 	}
		 	res.json(event);
		 });

	});
agendaRouter.get('/',userIsLoggedIn,function(req,res){
		 Agenda.find({}, function(err, agenda){
		 	console.log("ddd");
		 	res.render('agenda/agenda.html',{agenda:agenda});
		 });

	});
agendaRouter.post('/add', function(req, res){
  var agenda = new Agenda(
    {
      debut:req.body.debut,
      fin: req.body.fin,
      description:req.body.description,
			patient:req.user._id,
    }
  );

  	agenda.save((err) => {
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
      if (req.path=="/user/admin/agenda") {
        res.redirect('/user/admin/agenda');
      }
      else {
        res.redirect('/agenda');
      }

    }
  });
});
function userIsLoggedIn(req, res, next) {

    // Si l'utilisateur est authentifié dans la session, continuez
    if (req.isAuthenticated()){
      return next();
    }
    else {
      // s'ils ne les redirigent pas vers la page Interdit
      res.redirect('/Interdit');
    }
}

module.exports = agendaRouter;
