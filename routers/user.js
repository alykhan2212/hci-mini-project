const express = require("express");
const app = express();




var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  stringifyObjects : true
});


const router = express.Router();
	


function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/user/login');
  }
}

function Notrestrict(req, res, next) {
  if (!req.session.user) {
    next();
  } else {
    req.session.error = 'Access granted!';
    res.redirect('/user/bookmark');
  }
}

router.get('/login',Notrestrict, (req, res) => {
	
	
	 let context = {
	    title: "User | Login"
	  };
	 res.render("user/login", context);

});



router.get('/a',restrict, (req, res) => {
	
	 if(!req.session.user){
	 	 res.status(401).send();
	 }else{
	 	res.send(req.session.user);
	 }

});


router.post('/login', (req, res) => {

	let context = {
	  title: "User | Login"
	};
	let user_data = {
	    username: req.body.username.trim(),
	    password: req.body.pass.trim()
	    
	 };

	con.query('USE mydb', function (err) {
		var sql2 = "Select * From users where name ='"+user_data.username+"' AND password ='"+user_data.password+"'";
		con.query(sql2, function (err, result,fields) {
			if(err) throw err;
			if(result.length > 0){
				var data =  JSON.stringify(result[0]);
			
				console.log(data);

				namee = result[0].name;

				password = result[0].password;
				
				req.session.user = namee;
				res.redirect('/user/bookmark');	
				// res.render('user/bookmark')
			}else{
				res.render('user/login',{ err : 'Invalid Username OR Password'});
			}
			


		});

	}); 

	 //res.render("user/login", context);

});









router.get('/logout', (req, res) => {
		
	 req.session.destroy();
	 res.redirect("/user/login");

});






router.get('/register',Notrestrict, (req, res) => {
		
	 let context = {
	    title: "User | Register"
	  };
	 res.render("user/register", context);

});


router.post('/register',(req,res)=>{

	//console.log(`register = POST: ${req.url}`);
	let user_data = {
	    username: req.body.username.trim(),
	    password: req.body.pass.trim()
	    
	  };
	con.query('USE mydb', function (err) {
		var sql2 = "Select * From users where name ='"+user_data.username+"' ";
		var sql = "INSERT INTO users (name, password) VALUES ('" + user_data.username+ " ' , '" + user_data.password+ "')";
		con.query(sql2, function (err, result,fields) {
	    	if (err) throw err;
	    	console.log(result);
	    	// res.send(result);
	    	if(result.length !== 0){

	    		res.render('user/register',{ err : 'Username Already Exist'});
	    	}else{
    			con.query(sql, function (err, result) {
			    	if (err) throw err;
			    	console.log("1 record inserted");
			    	res.render('user/register',{ res : 'activation successfull'});
				});

	    	}

	  });	

    });


});





router.get('/add-bookmark',restrict, (req, res) => {
	
	 let context = {
	    title: "User | Bookmark"
	  };
	 res.render("user/bookmark", context);

});

router.post('/add-bookmark', (req, res) => {

	 let context = {
	    title: "User | Bookmark"
	  };

	  let user_data = {
	    title: req.body.title.trim(),
	    link: req.body.link.trim(),
	    sion : req.session.user
	    
	  };

	con.query('USE mydb', function (err) {
		if(err) throw err;

		var sql = "INSERT INTO bookmark (title, link, username) VALUES ('"+user_data.title+"' , '"+user_data.link+"' , '"+user_data.sion+ "')";
		con.query(sql, function (err, result,fields) {
			if(err) throw err;
			console.log("1 record inserted");
			res.render('user/bookmark',{ res : 'Bookmark successfully Added'});
		});

		// res.send(sql);
	});



});


router.get('/bookmark',restrict, (req, res) => {

	 if (!req.session.user) {
    	res.redirect('/user/login');
  	}
	var data = "";
	con.query('USE mydb', function (err) {
		if(err) throw err;

		var sql = "Select * From bookmark where username ='"+req.session.user+"'";
		con.query(sql, function (err, result,fields) {
			if(err) throw err;
			 // console.log(result[0].title);

			 for(var i = 0; i < result.length; ++i){
			 	data += "<li style='align:center;'>  <a href='"+result[i].link+"' style='font-size:20px;'> "+result[i].title+" </a> </li>"; 
			 }

			 res.render('user/list',{res: data});

		});

		
	});
	
});


module.exports = router;