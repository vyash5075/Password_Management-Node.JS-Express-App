var express = require('express');
var router = express.Router();
var userModel=require('../modules/user');


function checkEmail(req,res,next){
  var email=req.body.email;
  var checkexistemail=userModel.findOne({email:email});
  checkexistemail.exec((err,data)=>{
    if(err)throw err;
    if(data){
      return res.render('signup', { title: 'Password-Management-System',msg:'Email Already Exists' });
    }
    next();
  })
}

function checkUsername(req,res,next){
  var username=req.body.username;
  var usernameexistemail=userModel.findOne({username:username});
  usernameexistemail.exec((err,data)=>{
    if(err)throw err;
    if(data){
      return res.render('signup', { title: 'Password-Management-System',msg:'username Already Exists' });
    }
    next();
  })
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password-Management-System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password-Management-System' ,msg:''});
});


router.post('/signup',checkEmail,checkUsername, function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

  var userDetails=new  userModel({
    username:username,
    email:email,
    password:password,
  });
  userDetails.save((err,doc)=>{
    if(err)throw err;
    res.render('signup', { title: 'Password-Management-System',msg:'User Registered Successfully' });
  })

  
});
router.get('/passwordCategory', function(req, res, next) {
  res.render('password_category', { title: 'Password-Management-System' });
});

router.get('/add-new-category', function(req, res, next) {
  res.render('addNewCategory', { title: 'Password-Management-System' });
});

router.get('/add-new-password', function(req, res, next) {
  res.render('add-new-password', { title: 'Password-Management-System' });
});

router.get('/view-all-password', function(req, res, next) {
  res.render('view-all-password', { title: 'Password-Management-System' });
});

module.exports = router;
