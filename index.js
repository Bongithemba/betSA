import express from "express"; //express for creatin server
import mysql from "mysql"; //connecting to local database
import bodyParser from "body-parser"; //reading user input from forms 
import bcrypt from "bcrypt"; //hashing passwords from user input
import axios from 'axios';
import dotenv from 'dotenv'; // environment variables
import session from "express-session"; //stores data for current session 

const app = express();
const port = 3000;
dotenv.config({ path: '/home/student/betSA/.env'});
app.use(session({
  secret: 'Bong1Themb@', // change this to something secure
  resave: false,
  saveUninitialized: false
}));


app.listen(port, ()=>{
	console.log(`Connected on Port: ${port}`);
});

let con = mysql.createConnection(
	{
		host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
	}
); //configure connection to database

//********* All for sporting events **************/
const options = {
  method: 'GET',
  url: 'https://sportsbook-api2.p.rapidapi.com/v0/advantages/',
  params: {type: 'ARBITRAGE'},
  headers: {
    'x-rapidapi-key': 'df6985d70dmsh02dc2dacc683a0cp19beaajsn0723f8e88817',
    'x-rapidapi-host': 'sportsbook-api2.p.rapidapi.com'
  }
};
	//***************end********************/

con.connect((err)=>{
	if (err) throw err;
	console.log("Connected to database");
}) //connect to database

app.use(express.static("public")); //styles and js in this folder
app.use(bodyParser.urlencoded({extended: true})); //middleware for handling user input.


//******Startup*************** */
app.get("/", (req, res)=>{
	res.render("registration.ejs"); // landing page of the website.
});

app.get('/login', (req, res) => {
	res.render('login.ejs');
})

app.get('/home', (req, res) => {
	const email = req.session.email;

	if (!email) {
    // User not logged in
    return res.redirect('/login');
  }

	con.query(`SELECT * FROM users WHERE email = '${email}'`, function (err, result) {
    if (err) throw err;
    console.log(result[0]);
	let data = result[0]
    res.render('homepage.ejs', {content: data}); 
  	});

})
//***************************** */

app.post("/loginDetails", (req, res)=>{
	let email = req.body['email'];
	let password = req.body['password'];

	con.query(`SELECT * FROM users WHERE email = '${email}'`, function (err, result) {
    if (err) throw err;
	if (result.length === 0) {
        // No user with this email found
        return res.render('login.ejs', { message: "Email not found. Please register first." });
    }
    console.log(result[0].password);

	const user = result[0];


	bcrypt.compare(password, result[0].password, function(err, result) {
		if (err) throw err;
		console.log(result);
		if (result == false){
			res.render('index.ejs', {message: "Incorrect Password!Try Again"})
		} else {
			//Store user ID in session
			req.session.userID = user.userID;
			req.session.email = user.email;

			console.log("Session saved:", req.session);

			con.query(`SELECT * FROM users WHERE email = '${email}'`, function (err, result) {
   				if (err) throw err;
				let data = result[0]
    			res.render('homepage.ejs', {content: data}); 
  			});


		}
	});
	});
});


app.get('/dashboard', (req, res) =>{
		async function fetchData() {
		try {
			const response = await axios.request(options);
			let advantages = response.data.advantages;
			console.log(advantages[0])

			res.render("dashboard.ejs", {advantages})
		} catch (error) {
			console.error(error);
		}
	}

	fetchData();
})


app.post("/register", (req, res)=>{
	let username = req.body["username"];
	let email = req.body["email"];
	let password = req.body["password"];
	let finalPassword = req.body["retypePassword"];
	const saltRounds = 10;

	if (password != finalPassword){
		res.render("registration.ejs", {message: "Passwords much match"});
	}

	else {
		bcrypt.hash(finalPassword, saltRounds, function (err, hash) {
    		if (err) {
        	console.error(err);
			return;
    		}

			let sql = `INSERT INTO users (username, email, password, uuid) VALUES (?, ?, ?, FLOOR(RAND() * 90000) + 10000)`;
			con.query(sql, [username, email, hash], function (err, result){
			if (err) throw err;
			console.log("1 record inserted into 'users'");
			res.render('login.ejs');
			})
		});
	}
});

app.post('/betSlip', (req, res) => {
	let teamName = req.body['teamName'];
	let eventName = req.body['eventName'];
	let payout = req.body['payout'];

	const userID = req.session.userID;

	if (!userID) {
		return res.status(401).send("Unauthorized: User not logged in");
	}

	let sql = `INSERT INTO betSlip (event, winner, payout, uuid, userID) VALUES (?, ?, ?, FLOOR(RAND() * 90000) + 10000, ?)`;
	con.query(sql, [eventName, teamName, payout, userID], function (err, result){
	if (err) throw err;
	console.log("1 record inserted into 'betSlip'");

	con.query(`SELECT * FROM users WHERE userID = '${userID}'`, function (err, result) {
   		if (err) throw err;
		let data = result[0];
    	res.render('homepage.ejs', {content: data}); 
  		});

	
	})
		
});

app.get('/viewSlip', (req, res) => {

	const userID = req.session.userID;

	con.query(`SELECT * FROM betSlip WHERE userID = '${userID}'`, function (err, result) {
   		if (err) throw err;
		console.log(result);
    	console.log(typeof result)
	
    	res.render('betSlip.ejs', {bets: result}); 
  	})
	


});

app.post("/remove", (req, res)=>{ // delete a student's details
  let property = req.body["property"];
  let value = req.body["id-delete"];
  let sql = `DELETE FROM betSlip WHERE ${property} = ${con.escape(value)}`;
  con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records deleted: " + result.affectedRows);
  
  });
 res.redirect('/');
});

app.get('/adminLogin', (req, res) =>{
	let email = req.body['email'];
	let password = req.body['password'];

	let adminEmail = 'thembar@thecodingground.com'
	let adminPass = '1234Qwert'

	if (email == adminEmail && password == adminPass){

		con.query("SELECT * FROM users", function (err, result, fields) {
    	if (err) throw err;
    	console.log(result);
    	console.log(typeof result)
    	let data = JSON.stringify(result)
    	res.render('adminHomepage.ejs', {users: data}) // display in table form
  });
	} else {
		console.log('Admin details not correct!');
		res.redirect('/login.ejs')
	}
})



