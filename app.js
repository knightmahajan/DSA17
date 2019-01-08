var ejs 	     =	 require('ejs');
var mysql	     =	 require('mysql');
var express      =	 require('express');
var bodyParser   =	 require('body-parser');
var jwt 	     =	 require('jsonwebtoken');
var cookieParser =   require('cookie-parser');
var flash 		 = 	 require('connect-flash');
var session 	 =	 require('express-session');
var app 	     =	 express();
var cors 		 = 	 require('cors')
var moment 		 = 	 require('moment');
var urlencoder = bodyParser.urlencoded({extended : true});

moment().format();

var port = process.env.PORT || 8090;
var secret = 'SECRETSAUCE';

app.set('view engine', 'ejs');
app.set('views',__dirname+'/public/views');

app.use(cors());
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'srmdsa',
  database : 'srmdsa'
}); 

app.get("/login",function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
		if(!req.cookies.isLoggedin){
			res.render('login',{positiveMessage:msg,errorMessage:emsg});
		}else{
			res.redirect('/news');
		}
});

app.post('/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
		if(username=="srmdsa"){
			if(password == "apmtppv01"){  //if user exists in the database, match passwords and generate and return a token
				var token = jwt.sign({user:{
										username:'srmdsa'
									}},secret);
				res.cookie('jwtToken', token);
				res.cookie('isLoggedin',true);
				req.flash("positiveMessage","Logged in Successfully.");
					res.redirect("/news");        //else go to home page 
			}else{
				res.render('login',{errorMessage:"Incorrect Password"});
			}
		}
		else{
			res.render('login',{errorMessage:"Username not found"});
		}
});

app.get("/news",verifyToken,function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
	connection.query("select * from news",function(err,rows,field){
		if(err){throw err;}
		res.render("news",{rows:rows,isLoggedin:req.cookies.isLoggedin,moment:moment,positiveMessage:msg,errorMessage:emsg})
	});
});

app.get("/news/new",verifyToken,function(req,res){
	res.render("newnews");
});

app.post("/news/new",verifyToken,function(req,res){
	if(req.body.date.length==0){
		req.body.date=null;
	}
	var d = Object.keys(req.body).map(function(key){return req.body[key]});
	connection.query("insert into news (title,content,date,imgurl,venue,webpagelink,time,contact1,contact2,email) values (?,?,?,?,?,?,?,?,?,?)",d,function(err,rows,field){
		if(err){throw err}
		req.flash("positiveMessage","News Added.");
		res.redirect("/news");
	});
});

app.get("/news/edit/:newsid",verifyToken,function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
	connection.query("select * from news where newsid=?",req.params.newsid,function(err,news,field){
		res.render('editnews',{news:news[0],isLoggedin:req.cookies.isLoggedin,positiveMessage:msg,errorMessage:emsg,moment:moment});
	})
});

app.post("/news/edit/:newsid",verifyToken,function(req,res){
	if(req.body.date.length==0){
		req.body.date=null;
	}
	var d = Object.keys(req.body).map(function(key){return req.body[key]});
	var t = d.splice(0,1);
	d.push(t[0]);
	connection.query("UPDATE news set title=?,content=?,date=?,imgurl=?,venue=?,webpagelink=?,time=?,contact1=?,contact2=?,email=? where newsid=?",d,function(err,rows,field){
		if(err){
			console.log(err);
			throw err;
		}
		req.flash('positiveMessage','News Edited');
		res.redirect("/news");
	});
});

app.get("/news/delete/:newsid",verifyToken,function(req,res){
	var newsid = req.params.newsid;
	connection.query("DELETE FROM news WHERE newsid=?",[newsid],function(err,rows,fields){
		if(err){
			req.flash("errorMessage","Error");
			res.redirect("/news");
		}else{
			req.flash("positiveMessage","Deleted");
			res.redirect("/news");
		}
	})
});

// -------------EVENTS----------------
app.get("/events",verifyToken,function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
	connection.query("select * from events",function(err,rows,field){
		if(err){throw err;}
		res.render("events",{rows:rows,isLoggedin:req.cookies.isLoggedin,moment:moment,positiveMessage:msg,errorMessage:emsg})
	});
});

app.get("/events/edit/:eventid",verifyToken,function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
	connection.query("select * from events where eventid=?",req.params.eventid,function(err,events,field){
		res.render('editevent',{event:events[0],isLoggedin:req.cookies.isLoggedin,positiveMessage:msg,errorMessage:emsg,moment:moment});
	})
});

app.get("/events/new",verifyToken,function(req,res){
	res.render("newevent");
});

app.post("/events/new",verifyToken,function(req,res){
	if(req.body.date.length==0){
		req.body.date=null;
	}
	var d = Object.keys(req.body).map(function(key){return req.body[key]});
	connection.query("insert into events (title,content,date,imgurl,venue,webpagelink,time,contact1,contact2,email) values (?,?,?,?,?,?,?,?,?,?)",d,function(err,rows,field){
		if(err){throw err}
		req.flash("positiveMessage","Event Added.");
		res.redirect("/events");
	});
});

app.post("/events/edit/:eventid",verifyToken,function(req,res){
	if(req.body.date.length==0){
		req.body.date=null;
	}
	var d = Object.keys(req.body).map(function(key){return req.body[key]});
	var t = d.splice(0,1);
	d.push(t[0]);
	connection.query("UPDATE events set title=?,content=?,date=?,imgurl=?,venue=?,webpagelink=?,time=?,contact1=?,contact2=?,email=? where eventid=?",d,function(err,rows,field){
		if(err){
			console.log(err);
			throw err;
		}
		req.flash('positiveMessage','Event Edited');
		res.redirect("/events");
	});
});

app.get("/events/delete/:eventid",verifyToken,function(req,res){
	var eventid = req.params.eventid;
	connection.query("DELETE FROM events WHERE eventid=?",[eventid],function(err,rows,fields){
		if(err){
			req.flash("errorMessage","Error");
			res.redirect("/events");
		}else{
			req.flash("positiveMessage","Deleted");
			res.redirect("/events");
		}
	})
});

app.get("/api/news",function(req,res){
	connection.query("select * from news order by date desc",function(err,rows,field){
		if(err){throw err};
		res.json(rows);
	});
});

app.get("/api/events",function(req,res){
	connection.query("select * from events order by date desc",function(err,rows,field){
		if(err){throw err};
		res.json(rows);
	});
});

app.get("/logout",function(req,res){
	res.clearCookie('jwtToken');
	res.clearCookie('isLoggedin');
	req.flash("positiveMessage","You have been logged out.")
	res.redirect('/login');
})

app.get('/home',function(req,res){
	res.sendFile(__dirname+'/public/newnewhome.html');
});

app.get('/about',function(req,res){
	res.sendFile(__dirname+'/public/aboutus.html');
});
app.get('/clubs',function(req,res){
	res.sendFile(__dirname+'/public/clubs.html');
});
app.get('/contactus',function(req,res){
	var msg = req.flash('positiveMessage')[0];
	var emsg = req.flash('errorMessage')[0];
	res.render('contactus',{positiveMessage:msg,errorMessage:emsg});
});
app.get('/coreteam',function(req,res){
	res.sendFile(__dirname+'/public/team.html');
});
app.get('/counselling',function(req,res){
	res.sendFile(__dirname+'/public/counselling.html');
});

app.get('/gallery',function(req,res){
	res.sendFile(__dirname+'/public/gallery.html');
});

app.get("/houses",function(req,res){
	res.sendFile(__dirname+"/public/houses.html");
});

app.get('/newsletter',function(req,res){
	res.sendFile(__dirname+"/public/newsletter.html");
});

app.get("/blog/:id",function(req,res){
	var id = req.params.id;
	connection.query("select * from news where newsid = ?",[id],function(err,rows,field){
		if(err){
			throw err;
		}
		if(rows.length>0){
			var news = rows[0];
			res.render('blog',{news:news,moment:moment});
		}else{
			res.redirect('/home');
		}
	});
});

/*app.post('/contact' , urlencoder, function(req,res){

  // Create a SMTP transport object
  var transport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              //user: "kvmknight@gmail.com",
              user: req.body.inputemail,
              pass: req.body.password
          }
      });

  console.log('SMTP Configured');

  // Message object

   var message = {

      // sender info
      //from: 'kvmknight@gmail.com',
      from : req.body.inputemail,

      to: 'mohitkarangiya@gmail.com',

      // Subject of the message
      subject: 'DSA Query', 

      // plaintext body
      text: 'Name:' + req.body.inputname + '\n' + 'Registeration Number:' + req.body.inputcompany +  '\r' + '\r' + 'Message :' + req.body.inputcomment

      // HTML body
      //html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>'+
        //   '<p>Here\'s a nyan cat for you as an embedded attachment:<br/></p>'
  };

  console.log('Sending Mail');
  transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        req.flash('errorMessage','Some error occured. Contact Admins for further support!');
        return;
    }
    console.log('Message sent successfully!');

  //res.render('Mail sent!');
  console.log(req.body);
    transport.close(); 
    req.flash("positiveMessage",'Your message has been sent successfully. \n We will contact you within next 24 hours.')
    res.redirect("/contactus");
  });
});*/

app.get("*",function(req,res){
	res.redirect("/home");
});

app.listen(port,function(){
	console.log("Listening on port "+port);
});

function insertData(data){
	connection.query("insert into news (title,content,date,imgurl,venue,webpagelink,time,contact1,contact2,email) values (?,?,?,?,?,?,?,?,?,?)",data,function(err,rows,field){
		if(err){throw err}
	});
}

function verifyToken(req,res,next){
	var token = req.cookies.jwtToken;
	if(token){
		jwt.verify(token,secret,function(err,data){
			if(err){
				console.log(err,"Token Veify Error");
				throw err;
			}
		});
		next();
	}else{
		req.flash("errorMessage","You need to login first.");
		res.redirect("/login");
	}
}
//http-server -c-1 => host files