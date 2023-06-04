const LocalStrategy = require('passport-local').Strategy;
const User          = require('../app/models/user');
const fs            = require('fs');
var path            = require('path');

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', 
    new LocalStrategy({
      usernameField     : 'email',
      passwordField     : 'password',
      passReqToCallback : true
    },
    function (req, email, password, done) {
      User.findOne({'local.email': email}, 
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, req.flash('signupMessage', 'El e-mail ya esta registrado!'));
          } else {
            var newUser = new User();
            var dir = './user_files/'+newUser.generateHash(email);
            newUser.local.prefijo  = req.body.prefijo;
            newUser.local.nombre   = req.body.nombre;
            newUser.local.apellido = req.body.apellido;
            newUser.local.email    = email;
            newUser.local.mainPathFiles = dir;
            newUser.local.password = newUser.generateHash(password);
            fs.mkdir(dir, { recursive: true }, (err) => {
              if (err) throw err;
            });  
            newUser.save(function (err) {
            if (err) { throw err; }
            return done(null, newUser);
            });
          }
      });
    }
  ));

  passport.use('local-login', 
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function (req, email, password, done) {
      User.findOne({'local.email': email}, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, req.flash('loginMessage', 'Usuario no encontrado!'))
        }
        if (!user.validPassword(password)) {
          return done(null, false, req.flash('loginMessage', 'Contraseña Erronea!'));
        }
        return done(null, user);
      });
    }
  ));
}