import express from "express"; //express for creatin server
import mysql from "mysql"; //connecting to local database
import bodyParser from "body-parser"; //reading user input from forms 
import bcrypt from "bcrypt"; //hashing passwords from user input
import axios from 'axios';
import dotenv from 'dotenv'; // environment variables

const app = express();
const port = 3000;
dotenv.config({ path: '/home/student/betSA/.env'})


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
	bcrypt.compare(password, result[0].password, function(err, result) {
		if (err) throw err;
		console.log(result);
		if (result == false){
			res.render('index.ejs', {message: "Incorrect Password!Try Again"})
		} else {

	async function fetchData() {
		try {
			const response = await axios.request(options);
			let advantages = response.data.advantages;
			let data = JSON.stringify(advantages);
			console.log(advantages)
			let events = [];
			// events.push()
			// console.log(events);
			res.render("dashboard.ejs", {advantages})
		} catch (error) {
			console.error(error);
		}
	}

	fetchData();
			}
	});
	});
});



app.post('/events', (req, res) => {

let competitionKey = req.body["competitionKey"];

const options = {
  method: 'GET',
  url: 'https://sportsbook-api2.p.rapidapi.com/v0/competitions/Q63E-wddv-ddp4/instances',
  headers: {
    'x-rapidapi-key': 'df6985d70dmsh02dc2dacc683a0cp19beaajsn0723f8e88817',
    'x-rapidapi-host': 'sportsbook-api2.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
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
			console.log("1 record inserted");
			res.render('login.ejs');
			})
		});
	}
});



