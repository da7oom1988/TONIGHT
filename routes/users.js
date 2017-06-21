var express = require('express');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var router = express.Router();
var arrOfPic = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

// Register
router.get('/signup', function(req, res){
	res.render('signup', {title: 'SIGNUP', arrOfPic: arrOfPic});
});

// Login
router.get('/login', function(req, res){
	res.render('login', {title: 'LOG IN'});
});

// Register
router.post('/signup', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var avatar = req.body.avatar;
    console.log(req.body);

    //Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Eame is required').notEmpty();
    req.checkBody('email', 'Email is not valied').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords not match').equals(req.body.password);
    req.checkBody('avatar', 'Avatar is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
       res.render('signup',{errors: errors,arrOfPic: arrOfPic} )
    }else{
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            avatar: avatar
        });

            User.createUser(newUser , function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and you can login');
        res.redirect('/users/login');
        }
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err,user){
        if(err) done(err);
        if(!user) return done(null, false, {message: 'Incorrect user'});

        User.comparePassword(password, user.password , function(err, isMatch){
            if(err) don(err);
            if(isMatch){
                 return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect password.'});
            }

        });
    });
  }));

router.post('/login',
passport.authenticate('local',
{ successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
function(req,res){
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//logout
router.get('/logout', function(req,res){
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');

});

module.exports = router;