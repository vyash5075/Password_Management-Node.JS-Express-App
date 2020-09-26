var express = require('express');
var router = express.Router();
var userModel=require('../modules/user');
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

 function checkLoginUser(rq,res,next){
   var userToken=localStorage.getItem('userToken')
   try{
    var decoded=jwt.verify(userToken,'loginToken');

   }

   catch(err)
   {
      res.redirect('/');
   }
   next(); 
 }

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
  var username=req.body.uname;
  var usernameexistemail=userModel.findOne({username:username});
  usernameexistemail.exec((err,data)=>{
    if(err)throw err;
    if(data){
      return res.render('signup', { title: 'Password-Management-System',msg:'username Already Exists!!' });
    }
    next();
  })
}
/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser)
  {
    res.redirect('/dashboard');
  }
  else{
  res.render('index', { title: 'Password-Management-System',msg:'' });
  }
});

router.post('/', function(req, res, next) {
  var username= req.body.uname;
  var password= req.body.password;
  var checkuser=userModel.findOne({username:username});
  checkuser.exec((err,data)=>{
    if(err) throw err;
    var getUserId=data._id; 
    var getpassword=data.password; 
    if(bcrypt.compareSync(password,getpassword)){
      var token=jwt.sign({userId:getUserId},'loginToken');
      localStorage.setItem('userToken',token);
      localStorage.setItem('loginUser',username);
      res.redirect('/dashboard');
      // res.render('index', { title: 'Password-Management-System',msg:'User login Successfully!!' });

    }else{
      res.render('index', { title: 'Password-Management-System',msg:'Invalid username and password!!' });

    }
   
  }) 


 
});



router.get('/dashboard', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  res.render('dashboard', { title: 'Password-Management-System' ,loginUser:loginUser,msg:''});
});


router.get('/signup', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser)
  {
    res.redirect('/dashboard');
  }
  else{
  res.render('signup', { title: 'Password-Management-System' ,msg:''});
  }
});


router.post('/signup',checkEmail,checkUsername, function(req, res, next) {
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  if(password!=confpassword){
    res.render('signup', { title: 'Password-Management-System',msg:'Password not match!!' });
  }
else{
  password=bcrypt.hashSync(req.body.password,10); //in parameters pass pasword and salt . it will encrypt and store in password.
  var userDetails=new userModel({
    username:username,
    email:email,
    password:password,
  });
  userDetails.save((err,doc)=>{
    if(err)throw err;
    res.render('signup', { title: 'Password-Management-System',msg:'User Registered Successfully!!' });
  })
}
  
});
router.get('/passwordCategory',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  res.render('password_category', { title: 'Password-Management-System' ,loginUser:loginUser});
});

router.get('/add-new-category',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  res.render('addNewCategory', { title: 'Password-Management-System',loginUser:loginUser });
});

router.get('/add-new-password', checkLoginUser,function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  res.render('add-new-password', { title: 'Password-Management-System',loginUser:loginUser });
});


router.get('/view-all-password',checkLoginUser, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  res.render('view-all-password', { title: 'Password-Management-System',loginUser:loginUser });
});
router.get('/logout', function(req, res, next) {
     
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
 
});

module.exports = router;
