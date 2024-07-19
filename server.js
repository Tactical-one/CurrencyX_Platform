const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const port = 8080

// middleware helper functions within express
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// connect to mongodb
mongoose.connect('mongodb+srv://n01590640:vcdlcch7IzbL6zpY@cluster0.zpfjqyv.mongodb.net/project_currencyx?retryWrites=true&w=majority');

let Schema = mongoose.Schema;

// Create a schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('users', userSchema); 

// route to sign up
app.post('/signup', async (req, res) => {
    // Destructure the request body
    const { username, email, pswd } = req.body;

    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(pswd, 10);

        // Create a new user instance with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });
        
        // Save the new user to the database
        await newUser.save();
        
        // Send a response to the client to show an alert and redirect after 3 seconds
        res.send(`
            <script>
                alert('Sign up successful!');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 3000);
            </script>
        `);
    } catch (error) {
        res.status(500).send('Error signing up. Please try again.');
    }
});

// route to login
app.post('/login', async (req, res) => {
    // Destructure the request body
    const { email, pswd } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(pswd, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        // Send a response to the client to show an alert and redirect after 3 seconds  
        res.send(`
            <script>
                alert('Login successful!');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 3000);
            </script>
        `);
    } catch (error) {
        res.status(500).send('Error logging in. Please try again.');
    }
});


app.locals.titles = "CURRENCYX"

// route to serve index.html
app.get('/', (req, res) => {
    res.redirect('/home')
})

// route to serve index.html
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// route to serve signin.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})



let transactions = []  //array to store transactions

app.post('/form-submit', (req, res) => {
    //Take what was sent from the req.body and send into the route
    const {send_amount, send_currency, result, receive_currency} = req.body
    const newTransaction = {id: transactions.length + 1, send_amount, send_currency, result, receive_currency}
    transactions.push(newTransaction) // adds new transaction to the array
    })   

   // Endpoint to get all transactions in descending order 
app.get('/transactions', (req, res) => {
    const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);
    res.json(sortedTransactions) // returns the transaction array
})
