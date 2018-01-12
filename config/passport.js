const localStrategy=require('passport-local').Strategy;
const User=require("../models/user");
const bcryptjs=require('bcryptjs');
//définition de notre strategie local
module.exports=function(passport){
  passport.use(new localStrategy(
  function(username, password, done) {
    //verifier la correspandance d 'un utlisateur'
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'mauvais username.' });
      }
      //verifier le mot de passe d'un utlisateur
      bcryptjs.compare(password,user.password,
        function(err,isMatch){
          if (isMatch) {
            return done(null,user);
          }
          else {
            return done(null, false, { message: 'mauvais username.' });
          }

        }
      );
    });
  }
));
//serialize
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
}
