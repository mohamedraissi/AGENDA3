const express = require('express');
const loginUserRouter = express.Router();
var app=express();
const jwt=require("jsonwebtoken");
var User = require('../models/user');
app.set('secret', "Secretkey");
//
loginUserRouter.post('/', (req, res) => {
  User.findOne(
    {
      username: req.body.username ,
      password : req.body.pw
    },
    function(err, user){
    if(err || !user){
      res.send('Authentification failed');
    }
    else {
      var token = jwt.sign(
        { username: user.username, lastname : user.lastname , role : user.role },
        app.get("secret"),
        { expiresIn : "24h" }
      );
      res.json({
        success: true,
        msg : 'auth oki',
        user: user.lastname,
        token : token
      })
    }
  })
});
module.exports = loginUserRouter;
