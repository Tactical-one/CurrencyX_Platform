const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser') // for parsing data 
const mongoose = require('mongoose') // for mongodb
const bcrypt = require('bcrypt'); // for password hashing
const port = 8080

// middleware helper functions within express
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.locals.titles = "CURRENCYX" //title of the website

// connect to mongodb
mongoose.connect('mongodb+srv://n01590640:vcdlcch7IzbL6zpY@cluster0.zpfjqyv.mongodb.net/project_currencyx?retryWrites=true&w=majority');

let Schema = mongoose.Schema;

// Create a user schema
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


// create a transaction schema
const transactionSchema = new mongoose.Schema({
    send_amount: Number,
    send_currency: String,
    result: Number,
    receive_currency: String
});

const Transaction = mongoose.model('transactions', transactionSchema);

// route to create a new transaction
app.post('/form-submit', async (req, res) => {
    // Take what was sent from the req.body and send into the route
    const { send_amount, send_currency, result, receive_currency } = req.body;
    
    try {
        // Create a new transaction instance
        const newTransaction = new Transaction({ send_amount, send_currency, result, receive_currency });
        
        // Save the new transaction to the database
        await newTransaction.save();
        
        res.status(201).send('Transaction saved successfully');
    } catch (error) {
        res.status(500).send('Error saving transaction. Please try again.');
    }
});


// Endpoint to get all transactions in descending order
app.get('/transactions', async (req, res) => {
    try {
        // Fetch all transactions from the database and sort them in descending order by _id
        const sortedTransactions = await Transaction.find().sort({ _id: -1 });
        res.json(sortedTransactions); // returns the sorted transaction array
    } catch (error) {
        res.status(500).send('Error fetching transactions. Please try again.');
    }
});


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

