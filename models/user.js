var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var schema = mongoose.Schema({
    username: { type: String, index: true },
    password:String,
    email: String,
    name: String,
    avatar: Number
});

var User = module.exports = mongoose.model('user',schema);

module.exports.createUser = function(newUser, callback){
    console.log(newUser);
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password ,salt, function(err,hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByUsername = function(username, callback){
     var query = {username: username};
     User.findOne(query,callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
};

module.exports.comparePassword = function(password,hash, callback){
   bcrypt.compare(password,hash,function(err,isMatch){
       if(err) throw err;
       callback(null, isMatch);
   });
};
