var express = require('express');
var yelp = require('yelp-fusion');
var moment = require('moment');
var goingDb = require('../models/going');
var router = express.Router();

//yelp
var clientId = '3lO4PkJnx6w-P7fNgItUvA';
var clientSecret = '6tXuqKFegMuOf3eFMIWYrqcXdo9MfCIvqrqytbjqOjnj2mmWmTzHwg6yUkif12zD';


// Get Homepage
router.get('/',function(req, res){
	res.render('index', {title: 'HOME'});
});

router.post('/search',function(req,res){
    var arr =[];
    if(req.user){
        goingDb.find({userId: req.user._id  , date:moment().format("L")},function(err,data){
            if(err) console.log(err);
            if(data){
                for(var i =0 ; i < data.length ; i++){
                    arr.push(data[i].placeId);
                }
            }
        });
    }
     yelp.accessToken(clientId, clientSecret).then(function(response) {
        const client = yelp.client(response.jsonBody.access_token);

        client.search({
            term:'nightlife',
            location: req.body.location, //'san francisco, ca',
            limit: 10
        }).then(function(response) {
            for(var j = 0 ; j < response.jsonBody.businesses.length ; j++){
                response.jsonBody.businesses[j].arr = arr;
            }
            res.render('index', {title: 'HOME', places: response.jsonBody.businesses });
        }).catch(function(e){
             res.render('index', {title: 'HOME', error_msg:
              "Could not execute search, try specifying a more exact location."});
        });
    }).catch(function(e){
        res.render('index', {title: 'HOME', error_msg: "Check your input or Try agien later"});
    });

});

router.post('/going',ensureAuthenticated,function(req,res){
     var go = new goingDb({
        userId: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        placeId: req.body.id,
        date: moment().format("L"),
     });
     go.save();
    res.sendStatus(200);
});

router.post('/ungoing', ensureAuthenticated, function(req,res){
    goingDb.remove({userId: req.user._id , placeId: req.body.id},function(err){
        if(err) console.log(err);
    });
     res.sendStatus(200);
});


router.get('/isthere/:id',function(req,res){
    console.log(req.params.id);
    goingDb.find({placeId: req.params.id , date: moment().format("L")}, function(err,data){
        if(err) console.log(err);
        if(!data){
            res.render('isthere',{title:'who is there', error_msg:'Nobody there'});
        }else{
            res.render('isthere',{title:'who is there', there:data});
        }
    })
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.send({ redirect: '/users/login'});
	}
}

module.exports = router;